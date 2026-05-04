import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NativeModules } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import { useAuthSession } from '@features/auth';
import {
  REVENUECAT_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
  isRevenueCatConfigured,
} from './config';

/**
 * Public surface for RevenueCat. Kept intentionally small — we sell exactly
 * one product (the monthly Buzzkeepr subscription with a 7-day free trial),
 * so callers only need:
 *
 * - `isReady`: provider has finished initial sync. Gate any
 *   entitlement-dependent UI on this so we don't flash "not subscribed"
 *   before RC's first response lands.
 * - `isPro`: user currently has the entitlement. Source of truth for
 *   "should we let them past the paywall?"
 * - `subscriptionPriceString`: localised display price (e.g. "$9.95"). Null
 *   until offerings load.
 * - `purchase`: triggers the platform purchase sheet. Resolves to `true`
 *   when the entitlement is granted, `false` when the user cancels.
 *   Throws on real errors so the caller can surface them.
 * - `restorePurchases`: Apple-mandated path for reattaching an existing
 *   subscription on a new install or device. Resolves to the post-restore
 *   `isPro`.
 */
type RevenueCatContextValue = {
  isReady: boolean;
  isPro: boolean;
  subscriptionPriceString: string | null;
  purchase: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

const isRevenueCatNativeModuleAvailable = Boolean(NativeModules.RNPurchases);

const REVENUECAT_NATIVE_MODULE_ERROR =
  'RevenueCat native module is unavailable. Rebuild the app in a development build after installing the SDK. Expo Go will not work for purchases.';

const hasActiveEntitlement = (info: CustomerInfo | null): boolean =>
  Boolean(info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const { data: user } = useAuthSession();
  const shouldUseRevenueCat =
    isRevenueCatConfigured && isRevenueCatNativeModuleAvailable;

  const [isReady, setIsReady] = useState(!shouldUseRevenueCat);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [subscriptionPackage, setSubscriptionPackage] =
    useState<PurchasesPackage | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!shouldUseRevenueCat) {
        if (isRevenueCatConfigured && !isRevenueCatNativeModuleAvailable) {
          console.warn(REVENUECAT_NATIVE_MODULE_ERROR);
        }
        return;
      }

      try {
        await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

        const alreadyConfigured = await Purchases.isConfigured();
        if (!alreadyConfigured) {
          Purchases.configure({
            apiKey: REVENUECAT_API_KEY,
            appUserID: user?.id,
          });
        }

        const [offerings, info] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        if (!isMounted) {
          return;
        }

        // We use RevenueCat's standard `monthly` package slot; product IDs
        // are configured in the RC dashboard, not hardcoded here.
        setSubscriptionPackage(offerings.current?.monthly ?? null);
        setCustomerInfo(info);
      } catch (error) {
        console.error('RevenueCat initialization failed', error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    if (!shouldUseRevenueCat) {
      setIsReady(true);
      return;
    }

    const handleCustomerInfoUpdated = (info: CustomerInfo) => {
      if (isMounted) {
        setCustomerInfo(info);
      }
    };

    initialize();
    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdated);

    return () => {
      isMounted = false;
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdated);
    };
  }, [shouldUseRevenueCat, user?.id]);

  // Re-identify with RevenueCat whenever the app user changes. RC ties
  // entitlement state to its own user ID, so this keeps purchase history
  // aligned with the signed-in account across login/logout.
  useEffect(() => {
    if (!shouldUseRevenueCat || !isReady) {
      return;
    }

    const syncIdentity = async () => {
      try {
        if (user?.id) {
          const result = await Purchases.logIn(user.id);
          setCustomerInfo(result.customerInfo);
          return;
        }

        // RC starts anonymous on first launch; calling logOut in that state
        // throws "Called logOut but the current user is anonymous." We only
        // need to log out when transitioning away from a signed-in user.
        if (await Purchases.isAnonymous()) {
          return;
        }

        const info = await Purchases.logOut();
        setCustomerInfo(info);
      } catch (error) {
        console.error('RevenueCat identity sync failed', error);
      }
    };

    syncIdentity();
  }, [isReady, shouldUseRevenueCat, user?.id]);

  /**
   * Triggers the platform purchase sheet for the single subscription
   * package. Returns `true` if the entitlement is now active, `false` if
   * the user backed out. Real errors propagate so the caller can surface
   * them.
   */
  const purchase = async (): Promise<boolean> => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    if (!subscriptionPackage) {
      throw new Error(
        'Subscription package is not available yet. Try again in a moment.',
      );
    }

    try {
      const result = await Purchases.purchasePackage(subscriptionPackage);
      setCustomerInfo(result.customerInfo);
      return hasActiveEntitlement(result.customerInfo);
    } catch (error) {
      // RevenueCat tags user-cancelled purchases on the error object; treat
      // them as a soft negative rather than a thrown error.
      if (
        error instanceof Error &&
        (error as { userCancelled?: boolean }).userCancelled === true
      ) {
        return false;
      }
      throw error;
    }
  };

  /**
   * Asks the platform billing layer for any active subscriptions tied to
   * the current Apple ID / Google account and reconciles them with our
   * RevenueCat user. Required by App Store guideline 3.1.1 for every app
   * that sells subscriptions.
   */
  const restorePurchases = async (): Promise<boolean> => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    const info = await Purchases.restorePurchases();
    setCustomerInfo(info);
    return hasActiveEntitlement(info);
  };

  const value = useMemo<RevenueCatContextValue>(() => {
    return {
      isReady,
      isPro: hasActiveEntitlement(customerInfo),
      subscriptionPriceString: subscriptionPackage?.product.priceString ?? null,
      purchase,
      restorePurchases,
    };
    // `purchase` and `restorePurchases` are recreated each render but
    // closure-stable enough — callers don't memoise them, and the cost is
    // negligible compared to the value of a clean signature.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, customerInfo, subscriptionPackage]);

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);

  if (!context) {
    throw new Error('useRevenueCat must be used within RevenueCatProvider');
  }

  return context;
};
