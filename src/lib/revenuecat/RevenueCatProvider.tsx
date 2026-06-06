import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Linking, NativeModules, Platform } from 'react-native';
import Purchases, {
  // LOG_LEVEL,
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
 * - `isReady`: provider has finished initial sync **for the current auth
 *   user**. Gate any entitlement-dependent UI on this so we don't flash
 *   "not subscribed" on first sign-in while RC is still identifying.
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

// ---------------------------------------------------------------------------
// State model
// ---------------------------------------------------------------------------

/**
 * Provider sync state, modelled as a tagged union instead of a soup of
 * `isReady` / `customerInfo` / `customerInfoUserId` booleans-and-nulls.
 *
 * - `pending`: provider mounted but the first sync for the current auth
 *   user hasn't completed.
 * - `ready`: we have a CustomerInfo snapshot tied to a specific auth user
 *   id (or `null` for anonymous). `userId` is the auth user id this
 *   snapshot was fetched for — if it stops matching the current
 *   `user?.id ?? null`, callers will see `isReady === false` until the
 *   next sync lands. This is the mechanism that prevents the sign-in
 *   flicker; the mismatch is detected synchronously during render.
 * - `failed`: initial sync threw. Treated as "ready with no entitlement"
 *   so consumers unblock with `isPro: false` instead of spinning forever;
 *   a subsequent identity change re-runs the effect and retries.
 */
type SyncState =
  | { kind: 'pending' }
  | {
      kind: 'ready';
      userId: string | null;
      info: CustomerInfo;
      monthlyPackage: PurchasesPackage | null;
    }
  | { kind: 'failed'; userId: string | null };

const INITIAL_STATE: SyncState = { kind: 'pending' };

const stateInfo = (state: SyncState): CustomerInfo | null =>
  state.kind === 'ready' ? state.info : null;

const statePackage = (state: SyncState): PurchasesPackage | null =>
  state.kind === 'ready' ? state.monthlyPackage : null;

// ---------------------------------------------------------------------------
// Pure derivations
// ---------------------------------------------------------------------------

const hasActiveEntitlement = (info: CustomerInfo | null): boolean =>
  Boolean(info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);

/**
 * `entitlements.all` retains historical (now-expired) grants alongside
 * active ones. If the entitlement exists in `.all` but not in `.active`
 * the user is lapsed.
 */
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

/**
 * Narrow an `unknown` from a RevenueCat catch into the shape we care about.
 * RC's native bridge surfaces either an `Error` subclass or a plain object,
 * so we probe with `in` after confirming we have a non-null object — TS
 * narrows the property to `unknown` on its own, no casts required.
 */
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

// ---------------------------------------------------------------------------
// Effectful RC SDK calls
// ---------------------------------------------------------------------------

/**
 * Configures RC once per process and forces its identified user to match
 * the auth user. `Purchases.configure` is a no-op when RC was already
 * configured earlier in the session, so we have to logIn / logOut
 * explicitly to switch identities.
 */
const alignRevenueCatIdentity = async (
  userId: string | null,
): Promise<void> => {
  const alreadyConfigured = await Purchases.isConfigured();
  if (!alreadyConfigured) {
    Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId ?? undefined,
    });
  }
  if (userId) {
    await Purchases.logIn(userId);
    return;
  }
  if (!(await Purchases.isAnonymous())) {
    await Purchases.logOut();
  }
};

/**
 * Fetches the server-authoritative snapshot for the currently-identified
 * RC user. We invalidate first because `logIn` / `getCustomerInfo` can
 * otherwise return locally-cached info while a background server refresh
 * is still in flight — a stale `isPro: false` was what caused the
 * 'membership' → 'welcome' flash on sign-in.
 */
const fetchSnapshot = async (): Promise<{
  info: CustomerInfo;
  monthlyPackage: PurchasesPackage | null;
}> => {
  await Purchases.invalidateCustomerInfoCache();
  const [offerings, info] = await Promise.all([
    Purchases.getOfferings(),
    Purchases.getCustomerInfo(),
  ]);
  return { info, monthlyPackage: offerings.current?.monthly ?? null };
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isPending: isUserPending } = useAuthSession();
  const shouldUseRevenueCat =
    isRevenueCatConfigured && isRevenueCatNativeModuleAvailable;

  const [state, setState] = useState<SyncState>(INITIAL_STATE);

  // Derived during render so a userId mismatch is visible *immediately*
  // when auth flips `user.id` — no effect lag, no flicker window. `failed`
  // counts as ready too, otherwise a transient init error would freeze
  // consumers on the loader screen.
  const expectedUserId = user?.id ?? null;
  const isReady =
    !shouldUseRevenueCat ||
    (state.kind !== 'pending' && state.userId === expectedUserId);

  useEffect(() => {
    if (isUserPending) {
      return;
    }

    // Non-RC path: `isReady` already short-circuits to `true` via
    // `!shouldUseRevenueCat`, so consumers unblock without us touching
    // state. Just warn once if the native module is missing.
    if (!shouldUseRevenueCat) {
      if (isRevenueCatConfigured && !isRevenueCatNativeModuleAvailable) {
        console.warn(REVENUECAT_NATIVE_MODULE_ERROR);
      }
      return;
    }

    let cancelled = false;
    // Buffers a CustomerInfo update that arrives before the initial fetch
    // resolves — without this, the listener event would no-op (state is
    // still `pending`) and the trailing snapshot setState would overwrite
    // with stale data.
    let bufferedListenerInfo: CustomerInfo | null = null;

    const syncForCurrentUser = async () => {
      try {
        // await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
        await alignRevenueCatIdentity(expectedUserId);
        if (cancelled) {
          return;
        }
        const snapshot = await fetchSnapshot();
        if (cancelled) {
          return;
        }
        setState({
          kind: 'ready',
          userId: expectedUserId,
          info: bufferedListenerInfo ?? snapshot.info,
          monthlyPackage: snapshot.monthlyPackage,
        });
      } catch (error) {
        console.error('RevenueCat initialization failed', error);
        if (cancelled) {
          return;
        }
        setState({ kind: 'failed', userId: expectedUserId });
      }
    };

    const handleCustomerInfoUpdated = (info: CustomerInfo) => {
      if (cancelled) {
        return;
      }
      setState((prev) => {
        if (prev.kind === 'ready') {
          return { ...prev, info };
        }
        // Pre-`ready` (initial fetch still in flight): stash for the
        // snapshot transition to pick up.
        bufferedListenerInfo = info;
        return prev;
      });
    };

    syncForCurrentUser();
    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdated);

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdated);
    };
  }, [shouldUseRevenueCat, expectedUserId, isUserPending]);

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
    const monthlyPackage = statePackage(state);
    if (!monthlyPackage) {
      throw new Error(
        'Subscription package is not available yet. Try again in a moment.',
      );
    }
    try {
      const result = await Purchases.purchasePackage(monthlyPackage);
      setState((prev) =>
        prev.kind === 'ready' ? { ...prev, info: result.customerInfo } : prev,
      );
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
    setState((prev) => (prev.kind === 'ready' ? { ...prev, info } : prev));
    return hasActiveEntitlement(info);
  };

  const refreshCustomerInfo = async (): Promise<boolean> => {
    if (!shouldUseRevenueCat) {
      return hasActiveEntitlement(stateInfo(state));
    }
    const info = await Purchases.getCustomerInfo();
    setState((prev) => (prev.kind === 'ready' ? { ...prev, info } : prev));
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

    await Purchases.logIn(user.id);
    // Re-pull the full snapshot (info + offerings) so state stays a single
    // coherent unit. Going through `fetchSnapshot` here mirrors the main
    // effect's sync path instead of patching `info` alone.
    const snapshot = await fetchSnapshot();
    setState({
      kind: 'ready',
      userId: user.id,
      info: snapshot.info,
      monthlyPackage: snapshot.monthlyPackage,
    });
  };

  const openManageSubscription = async (): Promise<void> => {
    const url =
      Platform.OS === 'ios'
        ? 'itms-apps://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    await Linking.openURL(url);
  };

  const value = useMemo<RevenueCatContextValue>(() => {
    const info = stateInfo(state);
    const monthlyPackage = statePackage(state);
    // Gate every derived field on `isReady` — a stale snapshot from a
    // previous identity must never leak through during transitions, even
    // if a consumer ignored `isReady`. Asymmetry here would be a foot-gun
    // for the next field added.
    const { isOnTrial, trialDaysRemaining } = isReady
      ? getTrialState(info)
      : { isOnTrial: false, trialDaysRemaining: null };
    return {
      isReady,
      isPro: isReady && hasActiveEntitlement(info),
      isLapsed: isReady && hasLapsedEntitlement(info),
      isOnTrial,
      trialDaysRemaining,
      subscriptionPriceString: isReady
        ? (monthlyPackage?.product.priceString ?? null)
        : null,
      purchase,
      restorePurchases,
      ensureIdentified,
      refreshCustomerInfo,
      openManageSubscription,
    };
    // Action methods are recreated each render but closure-stable enough —
    // callers don't memoise them, and the cost is negligible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, state]);

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
