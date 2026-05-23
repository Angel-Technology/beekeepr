import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import { isVerificationDenied } from '../services/resolveVerifyIdentityRoute';

/**
 * Redirects the user off the verification flow when they have no business
 * being on it:
 *
 * - Persona Declined or Checkr Denied → home, where the denied flow takes
 *   over.
 * - Already has a finished badge → home, they've completed the flow.
 *
 * Everyone else is allowed through; the flow body picks the phase to render
 * based on `identityVerificationStatus`.
 */
export const useVerificationGate = (): void => {
  const router = useRouter();
  const { data: user } = useAuthSession();

  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const isDenied = isVerificationDenied(user);

  useEffect(() => {
    if (isDenied) {
      router.replace('/(main)');
    }
    // Approved badge intentionally stays in-flow so the congrats section
    // can render. The body owns the dismissal CTA from there.
  }, [badge, isDenied, router]);
};
