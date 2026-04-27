import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NativeModules } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import RevenueCatUI, {
  PAYWALL_RESULT,
} from 'react-native-purchases-ui';
import { useAuthSession } from '@features/auth';
import {
  isRevenueCatConfigured,
  REVENUECAT_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
  REVENUECAT_MONTHLY_PRODUCT_ID,
  REVENUECAT_YEARLY_PRODUCT_ID,
} from './config';

type RevenueCatContextValue = {
  isConfigured: boolean;
  isNativeModuleAvailable: boolean;
  isReady: boolean;
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  monthlyPackage: PurchasesPackage | null;
  yearlyPackage: PurchasesPackage | null;
  refresh: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  presentPaywall: () => Promise<PAYWALL_RESULT>;
  presentPaywallIfNeeded: () => Promise<PAYWALL_RESULT>;
  presentCustomerCenter: () => Promise<void>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

const isRevenueCatNativeModuleAvailable =
  Boolean(NativeModules.RNPurchases) &&
  Boolean(NativeModules.RNPaywalls) &&
  Boolean(NativeModules.RNCustomerCenter);

const REVENUECAT_NATIVE_MODULE_ERROR =
  'RevenueCat native modules are unavailable. Rebuild the app in a development build after installing the SDK. Expo Go will not work for purchases.';

const getPackageByProductId = (
  offering: PurchasesOffering | null,
  productId: string,
) => {
  return (
    offering?.availablePackages.find((pkg) => {
      return pkg.product.identifier === productId;
    }) ?? null
  );
};

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const { data: user } = useAuthSession();
  const shouldUseRevenueCat =
    isRevenueCatConfigured && isRevenueCatNativeModuleAvailable;
  const [isReady, setIsReady] = useState(!shouldUseRevenueCat);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);

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
        await Purchases.setLogLevel(
          __DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO,
        );

        const alreadyConfigured = await Purchases.isConfigured();

        if (!alreadyConfigured) {
          Purchases.configure({
            apiKey: REVENUECAT_API_KEY,
            appUserID: user?.id,
          });
        }

        const offerings = await Purchases.getOfferings();
        const info = await Purchases.getCustomerInfo();

        if (!isMounted) {
          return;
        }

        setCurrentOffering(offerings.current ?? null);
        setCustomerInfo(info);
      } catch (error) {
        console.error('RevenueCat initialization failed', error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    const handleCustomerInfoUpdated = (info: CustomerInfo) => {
      if (isMounted) {
        setCustomerInfo(info);
      }
    };

    if (!shouldUseRevenueCat) {
      setIsReady(true);
      return;
    }

    initialize();
    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdated);

    return () => {
      isMounted = false;
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdated);
    };
  }, [shouldUseRevenueCat, user?.id]);

  useEffect(() => {
    if (!shouldUseRevenueCat || !isReady) {
      return;
    }

    const syncIdentity = async () => {
      try {
        if (user?.id) {
          const result = await Purchases.logIn(user.id);
          setCustomerInfo(result.customerInfo);
        } else {
          const info = await Purchases.logOut();
          setCustomerInfo(info);
        }
      } catch (error) {
        console.error('RevenueCat identity sync failed', error);
      }
    };

    syncIdentity();
  }, [isReady, shouldUseRevenueCat, user?.id]);

  const refresh = async () => {
    if (!shouldUseRevenueCat) {
      return;
    }

    const [offerings, info] = await Promise.all([
      Purchases.getOfferings(),
      Purchases.getCustomerInfo(),
    ]);

    setCurrentOffering(offerings.current ?? null);
    setCustomerInfo(info);
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    try {
      const result = await Purchases.purchasePackage(pkg);
      setCustomerInfo(result.customerInfo);
      return result.customerInfo;
    } catch (error: any) {
      if (!error?.userCancelled) {
        console.error('RevenueCat purchase failed', error);
      }

      return null;
    }
  };

  const restorePurchases = async () => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('RevenueCat restore failed', error);
      return null;
    }
  };

  const presentPaywall = async () => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    return RevenueCatUI.presentPaywall({
      offering: currentOffering ?? undefined,
    });
  };

  const presentPaywallIfNeeded = async () => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    return RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: REVENUECAT_ENTITLEMENT_ID,
      offering: currentOffering ?? undefined,
    });
  };

  const presentCustomerCenter = async () => {
    if (!shouldUseRevenueCat) {
      throw new Error(REVENUECAT_NATIVE_MODULE_ERROR);
    }

    await RevenueCatUI.presentCustomerCenter();
  };

  const monthlyPackage = getPackageByProductId(
    currentOffering,
    REVENUECAT_MONTHLY_PRODUCT_ID,
  );
  const yearlyPackage = getPackageByProductId(
    currentOffering,
    REVENUECAT_YEARLY_PRODUCT_ID,
  );
  const isPro = Boolean(
    customerInfo?.entitlements.active[REVENUECAT_ENTITLEMENT_ID],
  );

  const value = useMemo<RevenueCatContextValue>(() => {
    return {
      isConfigured: isRevenueCatConfigured,
      isNativeModuleAvailable: isRevenueCatNativeModuleAvailable,
      isReady,
      isPro,
      customerInfo,
      currentOffering,
      monthlyPackage,
      yearlyPackage,
      refresh,
      purchasePackage,
      restorePurchases,
      presentPaywall,
      presentPaywallIfNeeded,
      presentCustomerCenter,
    };
  }, [
    isReady,
    isPro,
    customerInfo,
    currentOffering,
    monthlyPackage,
    yearlyPackage,
  ]);

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
