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
    // Approved + denied badges intentionally stay in-flow so the congrats /
    // denied sections can render. The body owns the dismissal CTA from
    // there. `isDenied` here is the Persona-declined check, which the
    // `IdentityDeclinedSection` already handles via the `declined` phase.
    void badge;
    void isDenied;
  }, [badge, isDenied, router]);
};
