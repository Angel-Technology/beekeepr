import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import {
  hasResumableVerification,
  isVerificationDenied,
} from '@features/verification';
import { useRevenueCat } from '@src/lib/revenuecat';
import type { BuzzFlow } from '../models/buzzFlow.types';

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
  const { isPro } = useRevenueCat();
  const params = useLocalSearchParams<{ backgroundCheck?: string }>();
  const hasSubmittedBackgroundCheck = params.backgroundCheck === 'submitted';
  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const isDenied = isVerificationDenied(user);
  const isApproved = badge === BackgroundCheckBadge.Approved;
  const needsMembership = isApproved && !isPro;

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
    // Approved-but-not-subscribed users see the same highlighted verify
    // card as fresh users; copy + handler change via `ctaLabel` /
    // `onGetStarted` below.
    return 'verify';
  }, [isApproved, isPro, isDenied, hasSubmittedBackgroundCheck]);

  const ctaLabel = needsMembership
    ? 'Start membership'
    : hasResumableVerification(user)
      ? 'Resume'
      : 'Get Started';

  const onGetStarted = () => {
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

  return {
    flow,
    ctaLabel,
    onGetStarted,
    onLearnMore,
    resetSubmittedBackgroundCheck: () => {
      router.replace('/');
    },
  };
};
