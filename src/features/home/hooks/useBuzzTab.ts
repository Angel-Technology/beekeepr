import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import {
  hasResumableVerification,
  isVerificationDenied,
} from '@features/verification';
import { useTrialPurchase } from '@features/verification/hooks/useTrialPurchase';
import { useErrorModal } from '@src/lib/error-modal';
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
 * - `'active'`: transient state right after submitting the criminal-check
 *   form, before the cache re-derives.
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
  const { data: user } = useAuthSession();
  const { isPro, isLapsed, purchase } = useRevenueCat();
  const { isPurchasing, startTrial } = useTrialPurchase();
  const { showFromError } = useErrorModal();
  const params = useLocalSearchParams<{ backgroundCheck?: string }>();
  const hasSubmittedBackgroundCheck = params.backgroundCheck === 'submitted';
  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const isDenied = isVerificationDenied(user);
  const isApproved = badge === BackgroundCheckBadge.Approved;
  const needsMembership = isApproved && !isPro;
  // Lapsed subscribers have already seen the trial pitch and made a choice
  // once — bouncing them through /verify-learn-more again is friction. Send
  // them straight to the OS purchase sheet via RevenueCat's `purchase()`.
  const needsRenewal = needsMembership && isLapsed;

  const flow = useMemo<BuzzFlow>(() => {
    // Denied (Persona Declined or Checkr Denied) trumps the post-submit
    // celebration — we don't want to flash a welcome screen before the
    // denied screen lands.
    if (isDenied) {
      return 'denied';
    }
    if (hasSubmittedBackgroundCheck) {
      return 'active';
    }
    if (isApproved && isPro) {
      return 'welcome';
    }
    if (needsMembership) {
      return 'membership';
    }
    return 'verify';
  }, [
    isApproved,
    isPro,
    isDenied,
    hasSubmittedBackgroundCheck,
    needsMembership,
  ]);

  const ctaLabel = needsRenewal
    ? 'Renew membership'
    : needsMembership
      ? 'Start membership'
      : hasResumableVerification(user)
        ? 'Resume'
        : 'Get Started';

  const handleRenewalPurchase = async () => {
    try {
      await purchase();
    } catch (error) {
      showFromError(error, 'Purchase Failed');
    }
  };

  const onGetStarted = () => {
    if (needsRenewal) {
      void handleRenewalPurchase();
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
      // TODO: wire promo-code redemption when the offer set is finalised.
      onEnterPromoCode: () => {},
    },
    resetSubmittedBackgroundCheck: () => {
      router.replace('/');
    },
  };
};
