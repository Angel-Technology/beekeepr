import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { useCompleteProfile } from '@features/account/hooks/useCompleteProfile';
import { useRedeemPromoCode } from '@features/account/hooks/useRedeemPromoCode';
import { useSearchUsers } from '@features/account/hooks/useSearchUsers';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import {
  hasResumableVerification,
  isVerificationDenied,
} from '@features/verification';
import { useTrialPurchase } from '@features/verification/hooks/useTrialPurchase';
import { useRevenueCat } from '@src/lib/revenuecat';
import type { BuzzFlow } from '../models/buzzFlow.types';

const TRIAL_LENGTH_DAYS = 30;
const REMINDER_LEAD_DAYS = 5;

const addDays = (value: Date, days: number) => {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
};

const formatLongDate = (value: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(value);

/**
 * Drives the TheBuzz tab — the post-auth landing screen on the bottom-tab
 * navigation. One screen, four render variants, one hook.
 *
 * Flow derivation:
 * - `'denied'`: terminal Persona-declined or Checkr-denied user.
 * - `'welcome'`: badge approved AND user has an active subscription
 *   (`isPro`) — the search community body.
 * - `'verify'`: everything else — either the user hasn't completed
 *   verification, or they're approved but haven't started / have lapsed
 *   their membership. CTA copy + destination shift based on which sub-case
 *   they're in (see `ctaLabel` / `onGetStarted`).
 *
 * `ctaLabel` priority:
 * 1. `'Start membership'` — badge approved but no active subscription
 *    (never subscribed OR trial over). Routes to the trial-info screen.
 * 2. `'Resume'` — mid-verification (Persona started, not finished).
 * 3. `'Get Started'` — fresh user.
 */
export const useBuzzTab = () => {
  const router = useRouter();
  const { data: user, isPending: isUserPending } = useAuthSession();
  const { isReady: isRevenueCatReady, isPro, isLapsed } = useRevenueCat();
  const { isPurchasing, startTrial } = useTrialPurchase();

  const [searchQuery, setSearchQuery] = useState('');
  const {
    debouncedQuery: searchDebouncedQuery,
    results: searchResults,
    isFetching: isSearchFetching,
  } = useSearchUsers(searchQuery);

  // "Create a profile" modal visibility + form state. Lives here so the
  // presentation layer stays dumb and so `useCompleteProfile.onSaved` can
  // close the modal directly when the mutation resolves (cleaner than
  // letting the parent infer dismissal from `isProfileIncomplete`).
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileForm = useCompleteProfile({
    onSaved: () => setShowProfileModal(false),
  });

  // Promo-code modal is shared by membership + renewal CTAs. The flow on
  // success: hook refreshes RC → `isPro` flips → flow derivation drops
  // from 'membership'/'renewal' to 'welcome' → modal closes. The user
  // sees the screen transform; no separate "promo applied!" surface.
  const [showPromoModal, setShowPromoModal] = useState(false);
  const promoCodeForm = useRedeemPromoCode({
    onRedeemed: () => setShowPromoModal(false),
  });
  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const isDenied = isVerificationDenied(user);
  const isApproved = badge === BackgroundCheckBadge.Approved;
  const needsMembership = isApproved && !isPro;
  // Lapsed subscribers have already seen the trial pitch and made a choice
  // once — bouncing them through /verify-learn-more again is friction. Send
  // them straight to the OS purchase sheet via RevenueCat's `purchase()`.
  const needsRenewal = needsMembership && isLapsed;

  // Until both the auth session AND the RevenueCat customer info have
  // resolved, `isPro`/`isApproved` are unreliable defaults (both false).
  // Returning `null` lets the screen render a loader instead of flashing
  // through 'verify' → 'membership' → 'welcome' as each source lands.
  const isResolving = isUserPending || !isRevenueCatReady;

  const flow = useMemo<BuzzFlow | null>(() => {
    if (isResolving) {
      return null;
    }
    if (isDenied) {
      return 'denied';
    }
    if (isApproved && isPro) {
      return 'welcome';
    }
    // Lapsed before fresh — a previously-subscribed user can't use the
    // trial again (Apple/Google won't honor a second free trial for the
    // same subscription group), so we route them to a renewal-focused
    // view instead of pitching "Start 30-day free trial".
    if (needsRenewal) {
      return 'renewal';
    }
    if (needsMembership) {
      return 'membership';
    }
    return 'verify';
  }, [
    isResolving,
    isApproved,
    isPro,
    isDenied,
    needsMembership,
    needsRenewal,
  ]);

  const ctaLabel = needsRenewal
    ? 'Renew membership'
    : needsMembership
      ? 'Start membership'
      : hasResumableVerification(user)
        ? 'Resume'
        : 'Get Started';

  const onGetStarted = () => {
    if (needsRenewal) {
      void startTrial();
      return;
    }
    if (needsMembership) {
      router.push('/verify-learn-more');
      return;
    }
    router.push('/verify-identity');
  };

  // Approved-but-not-subscribed users already have the primary CTA pointing
  // at /verify-learn-more, so a second "Learn more" button would just be
  // noise. Hide it for them by omitting the handler.
  const onLearnMore = needsMembership
    ? undefined
    : () => router.push('/verify-learn-more');

  const trialEndDate = addDays(new Date(), TRIAL_LENGTH_DAYS);

  return {
    flow,
    ctaLabel,
    onGetStarted,
    onLearnMore,
    membershipProps: {
      isPurchasing,
      reminderLabel: `In ${TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days`,
      trialEndLabel: formatLongDate(trialEndDate),
      onStartTrial: () => {
        void startTrial();
      },
      onEnterPromoCode: () => setShowPromoModal(true),
    },
    renewalProps: {
      isPurchasing,
      onRenew: () => {
        void startTrial();
      },
      onEnterPromoCode: () => setShowPromoModal(true),
    },
    promoModalProps: {
      visible: showPromoModal,
      code: promoCodeForm.code,
      error: promoCodeForm.error,
      isRedeeming: promoCodeForm.isRedeeming,
      canRedeem: promoCodeForm.canRedeem,
      onChangeCode: promoCodeForm.setCode,
      onRedeem: promoCodeForm.redeem,
      onClose: () => {
        promoCodeForm.reset();
        setShowPromoModal(false);
      },
    },
    welcomeProps: {
      searchQuery,
      searchDebouncedQuery,
      searchResults,
      isSearchFetching,
      onChangeSearchQuery: setSearchQuery,
      // Subscribed users without nickname/handle can't be found by others
      // in the search — surface the soft-nag modal until they fill it in
      // (or explicitly dismiss).
      isProfileIncomplete: !user?.nickname || !user?.handle,
      showProfileModal,
      onOpenProfileModal: () => setShowProfileModal(true),
      profileForm: {
        nickname: profileForm.nickname,
        handle: profileForm.handle,
        onChangeNickname: profileForm.setNickname,
        onChangeHandle: profileForm.setHandle,
        nicknameStatus: profileForm.nicknameStatus,
        handleStatus: profileForm.handleStatus,
        handleReason: profileForm.handleReason,
        isValid: profileForm.isValid,
        isSaving: profileForm.isSaving,
        onSave: profileForm.save,
      },
    },
  };
};
