import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Linking, NativeModules, Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
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
 * - `subscriptionPriceString`: localised display price (e.g. "$9.99"). Null
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
  /**
   * `true` when the user has held the entitlement in the past but does not
   * currently. Distinguishes lapsed subscribers (skip the trial pitch, go
   * straight to checkout) from never-subscribed users (sell the trial).
   */
  isLapsed: boolean;
  /**
   * `true` when the active entitlement is in its trial period (RC's
   * `periodType === TRIAL`). Used by the home tab to render the
   * trial-countdown card.
   */
  isOnTrial: boolean;
  /**
   * Whole days remaining on the active trial, rounded up so that "<1 day"
   * still reads as "1 day left". `null` when the user is not on a trial.
   */
  trialDaysRemaining: number | null;
  subscriptionPriceString: string | null;
  purchase: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  /**
   * Guarantees the signed-in user is identified to RevenueCat before
   * returning, calling `Purchases.logIn(user.id)` if RC is still anonymous
   * or holding a stale app user ID. Idempotent — safe to await before any
   * server-side RC operation (e.g. promo-code grants) where the backend
   * needs an existing subscriber record to attach an entitlement to.
   */
  ensureIdentified: () => Promise<void>;
  /**
   * Forces a re-pull of customer info from RevenueCat and updates context.
   * Use after a server-side entitlement change (e.g. a promo-code redemption)
   * so `isPro` flips without waiting on RC's listener to fire.
   */
  refreshCustomerInfo: () => Promise<boolean>;
  /**
   * Opens the device's native subscription management screen. Apps can't
   * cancel IAP subscriptions programmatically — Apple/Google reserve that
   * for the store UI. This deep-link is the closest we get.
   */
  openManageSubscription: () => Promise<void>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

const isRevenueCatNativeModuleAvailable = Boolean(NativeModules.RNPurchases);

const REVENUECAT_NATIVE_MODULE_ERROR =
  'RevenueCat native module is unavailable. Rebuild the app in a development build after installing the SDK. Expo Go will not work for purchases.';

const hasActiveEntitlement = (info: CustomerInfo | null): boolean =>
  Boolean(info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);

// Narrow an `unknown` from a RevenueCat catch into the shape we care about.
// RC's native bridge can surface either an `Error` subclass or a plain
// object, so we probe with `in` after confirming we have a non-null object —
// TS narrows the property to `unknown` on its own, no casts required.
const isUserCancelledPurchaseError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  if (
    'code' in error &&
    typeof error.code === 'string' &&
    error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  ) {
    return true;
  }
  if ('userCancelled' in error && error.userCancelled === true) {
    return true;
  }
  return false;
};

// `entitlements.all` retains historical (now-expired) grants alongside
// active ones. If the entitlement exists in `.all` but not in `.active`
// the user is lapsed.
const hasLapsedEntitlement = (info: CustomerInfo | null): boolean => {
  if (!info) {
    return false;
  }
  if (info.entitlements.active[REVENUECAT_ENTITLEMENT_ID]) {
    return false;
  }
  return Boolean(info.entitlements.all[REVENUECAT_ENTITLEMENT_ID]);
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getTrialState = (
  info: CustomerInfo | null,
): { isOnTrial: boolean; trialDaysRemaining: number | null } => {
  const entitlement = info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID];
  if (!entitlement || entitlement.periodType !== 'TRIAL') {
    return { isOnTrial: false, trialDaysRemaining: null };
  }
  if (!entitlement.expirationDate) {
    // Lifetime trial (unlikely) — treat as no countdown but still on trial.
    return { isOnTrial: true, trialDaysRemaining: null };
  }
  const msRemaining =
    new Date(entitlement.expirationDate).getTime() - Date.now();
  // Round up so the last partial day still reads as "1 day left" instead of
  // flipping to 0 before the trial actually ends.
  const trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / MS_PER_DAY));
  return { isOnTrial: true, trialDaysRemaining };
};

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isPending: isUserPending } = useAuthSession();
  const shouldUseRevenueCat =
    isRevenueCatConfigured && isRevenueCatNativeModuleAvailable;

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  // Tracks which auth user the current `customerInfo` was loaded for.
  // `undefined` = never loaded, `null` = loaded for an anonymous user,
  // `string` = loaded for that signed-in user id. We derive `isReady` from
  // `customerInfoUserId === (user?.id ?? null)` *during render* — so the
  // moment auth flips `user.id`, the mismatch is visible synchronously and
  // consumers see `isResolving: true` on the very same render. No effect
  // lag means no stale 'membership' flash during sign-in.
  const [customerInfoUserId, setCustomerInfoUserId] = useState<
    string | null | undefined
  >(undefined);
  const [subscriptionPackage, setSubscriptionPackage] =
    useState<PurchasesPackage | null>(null);

  const expectedUserId = user?.id ?? null;
  const isReady =
    !shouldUseRevenueCat ||
    (customerInfoUserId !== undefined && customerInfoUserId === expectedUserId);

  useEffect(() => {
    // Wait for the auth session to resolve before configuring RC. Otherwise
    // we configure anonymously, flip `isReady=true` with `isPro=false`, and
    // only later (after the identity-sync effect logs the user in) does
    // `isPro` flip to the real value. Consumers like `useBuzzTab` derive
    // their flow off `isReady && isPro`, so that intermediate state flashes
    // a wrong screen (e.g. 'membership' before snapping to 'welcome').
    if (isUserPending) {
      return;
    }

    if (!shouldUseRevenueCat) {
      if (isRevenueCatConfigured && !isRevenueCatNativeModuleAvailable) {
        console.warn(REVENUECAT_NATIVE_MODULE_ERROR);
      }
      // Stamp the loaded user so the derived `isReady` flips to `true` even
      // on the non-RC path.
      setCustomerInfoUserId(user?.id ?? null);
      return;
    }

    let isMounted = true;

    const initialize = async () => {
      try {
        await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

        const alreadyConfigured = await Purchases.isConfigured();
        if (!alreadyConfigured) {
          Purchases.configure({
            apiKey: REVENUECAT_API_KEY,
            appUserID: user?.id,
          });
        }

        // Force RC's identity to match the current auth user before we
        // touch customerInfo. `Purchases.configure` is a no-op once RC was
        // configured earlier in the session, so we have to explicitly
        // logIn/logOut to switch users.
        if (user?.id) {
          await Purchases.logIn(user.id);
        } else if (!(await Purchases.isAnonymous())) {
          await Purchases.logOut();
        }
        if (!isMounted) {
          return;
        }

        // `logIn`/`getCustomerInfo` can return RC's locally-cached
        // CustomerInfo while a background server refresh is still in
        // flight — for a pro user that briefly reports `isPro: false`
        // before the listener fires with the real value. Invalidating
        // forces the next read to hit the network so what we commit is
        // server-authoritative.
        await Purchases.invalidateCustomerInfoCache();

        const [offerings, info] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        if (!isMounted) {
          return;
        }

        setSubscriptionPackage(offerings.current?.monthly ?? null);
        setCustomerInfo(info);
        setCustomerInfoUserId(user?.id ?? null);
      } catch (error) {
        console.error('RevenueCat initialization failed', error);
      }
    };

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
  }, [shouldUseRevenueCat, user?.id, isUserPending]);

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
      if (isUserCancelledPurchaseError(error)) {
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

  const refreshCustomerInfo = async (): Promise<boolean> => {
    if (!shouldUseRevenueCat) {
      return hasActiveEntitlement(customerInfo);
    }

    const info = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
    return hasActiveEntitlement(info);
  };

  const ensureIdentified = async (): Promise<void> => {
    if (!shouldUseRevenueCat || !user?.id) {
      return;
    }

    // RC issues `$RCAnonymousID:<uuid>` when no `appUserID` was provided at
    // configure time. We also re-logIn if the configured ID drifted from
    // the current auth user (e.g. account-switch mid-session). Server-side
    // promo grants need a non-anonymous subscriber to attach to, so this
    // is the gate we hold before any backend RC operation.
    const currentAppUserId = await Purchases.getAppUserID();
    if (currentAppUserId === user.id) {
      return;
    }

    const result = await Purchases.logIn(user.id);
    setCustomerInfo(result.customerInfo);
  };

  const openManageSubscription = async (): Promise<void> => {
    const url =
      Platform.OS === 'ios'
        ? 'itms-apps://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    await Linking.openURL(url);
  };

  const value = useMemo<RevenueCatContextValue>(() => {
    const { isOnTrial, trialDaysRemaining } = getTrialState(customerInfo);
    // Gate the entitlement booleans on `isReady` so a stale customerInfo
    // from a previous user never leaks through during identity transitions.
    return {
      isReady,
      isPro: isReady && hasActiveEntitlement(customerInfo),
      isLapsed: isReady && hasLapsedEntitlement(customerInfo),
      isOnTrial,
      trialDaysRemaining,
      subscriptionPriceString: subscriptionPackage?.product.priceString ?? null,
      purchase,
      restorePurchases,
      ensureIdentified,
      refreshCustomerInfo,
      openManageSubscription,
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
