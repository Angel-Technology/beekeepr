import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import {
  hasResumableVerification,
  isVerificationDenied,
  resolveVerifyIdentityRoute,
} from '@features/verification';
import { useRevenueCat } from '@src/lib/revenuecat';
import type { BuzzFlow } from '../models/buzzFlow.types';

/**
 * Drives the TheBuzz tab — the post-auth landing screen on the bottom-tab
 * navigation. One screen, three render variants, one hook.
 *
 * Returned shape:
 * - `flow`: which body to render — `'verify'` (paywall + trial CTA),
 *   `'welcome'` (post-badge celebration), `'active'` (transient state right
 *   after submitting the criminal-check form, before the cache re-derives).
 * - `ctaLabel` + `onGetStarted`: the verify CTA, only relevant in the
 *   `'verify'` variant. Label flips to "Resume" when the user has paid but
 *   hasn't completed verification, and the handler routes through
 *   `resolveVerifyIdentityRoute` so deep-linked entries land at the right
 *   step rather than always the paywall.
 * - `resetSubmittedBackgroundCheck`: drops the `?backgroundCheck=submitted`
 *   query param so the `'active'` variant yields back to `'welcome'` once
 *   the user dismisses the post-submit celebration.
 *
 * Why one hook: this used to be split between `useBuzzScreen` (flow
 * derivation) and `useBuzzVerifyFlow` (CTA wiring). They both drove the
 * same screen and only the same screen — the split added a layer without
 * giving us reusability.
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
    if (isApproved) {
      return 'welcome';
    }
    return 'verify';
  }, [isApproved, isDenied, hasSubmittedBackgroundCheck]);

  const ctaLabel = hasResumableVerification({ user, isPro })
    ? 'Resume'
    : 'Get Started';

  const onGetStarted = () => {
    const next = resolveVerifyIdentityRoute({ user, isPro });
    if (next) {
      router.push(next);
    }
  };

  return {
    flow,
    ctaLabel,
    onGetStarted,
    resetSubmittedBackgroundCheck: () => {
      router.replace('/');
    },
  };
};
