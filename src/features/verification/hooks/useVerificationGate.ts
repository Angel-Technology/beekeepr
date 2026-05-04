import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  BackgroundCheckBadge,
  IdentityVerificationStatus,
  useAuthSession,
} from '@features/auth';
import { useRevenueCat } from '@src/lib/revenuecat';
import { isVerificationDenied } from '../services/resolveVerifyIdentityRoute';

/**
 * Step a screen requires the user to have already cleared:
 *
 * - `subscription`: user must be `isPro` (paid). Used by the kickoff screen,
 *   which is only reachable after paying.
 * - `identity-approved`: user must be paid AND past Persona ID verification.
 *   Used by the criminal-check explainer and find-records form, which sit
 *   after Persona in the flow.
 */
export type VerificationGateRequirement = 'subscription' | 'identity-approved';

/**
 * Centralises the "am I allowed to be on this screen?" redirects that every
 * post-paywall verification screen used to re-implement.
 *
 * Three outcomes:
 * 1. User already has a finished badge → redirect home. They've completed
 *    the flow; nothing to do here.
 * 2. User hasn't paid yet → redirect to the paywall. Skipped while RevenueCat
 *    is still resolving (`!isReady`) so we don't bounce on a stale `false`.
 * 3. Screen requires `identity-approved` and Persona hasn't approved yet →
 *    redirect to the kickoff screen so they can complete ID verification.
 *
 * Why this lives in one place: each downstream screen had its own pair of
 * `useEffect` redirects against `status` and `badge`. Duplication drifted
 * (e.g. one screen forgot the `isReady` guard) and made changes risky. One
 * gate, one source of truth.
 */
export const useVerificationGate = (
  requires: VerificationGateRequirement,
): void => {
  const router = useRouter();
  const { data: user } = useAuthSession();
  const { isPro, isReady: isRevenueCatReady } = useRevenueCat();

  const status =
    user?.identityVerificationStatus ?? IdentityVerificationStatus.NotStarted;
  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const isDenied = isVerificationDenied(user);

  useEffect(() => {
    // Persona Declined or Checkr Denied → home, where the denied flow takes
    // over. Checked first so a denied user can't slip past via the badge or
    // identity-approved branches below.
    if (isDenied) {
      router.replace('/(main)');
      return;
    }

    if (badge !== BackgroundCheckBadge.None) {
      router.replace('/(main)');
      return;
    }

    if (!isRevenueCatReady) {
      return;
    }

    if (!isPro) {
      router.replace('/verify-identity');
      return;
    }

    if (
      requires === 'identity-approved' &&
      status !== IdentityVerificationStatus.Approved
    ) {
      router.replace('/verify-identity/identity');
    }
  }, [badge, isDenied, isRevenueCatReady, isPro, status, requires, router]);
};
