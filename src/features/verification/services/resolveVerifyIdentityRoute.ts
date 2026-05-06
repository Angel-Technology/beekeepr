import {
  BackgroundCheckBadge,
  IdentityVerificationStatus,
  type AuthUser,
} from '@features/auth';

export type VerifyIdentityRoute =
  | '/verify-identity'
  | '/verify-identity/identity';

type ResolveInput = {
  user: AuthUser | null | undefined;
  isPro: boolean;
};

const RESUMABLE_STATUSES: ReadonlySet<IdentityVerificationStatus> = new Set([
  IdentityVerificationStatus.Created,
  IdentityVerificationStatus.Pending,
  IdentityVerificationStatus.Completed,
  IdentityVerificationStatus.NeedsReview,
  IdentityVerificationStatus.Approved,
]);

/**
 * True when the user has hit a terminal "we can't approve you" state — either
 * Persona declined the identity check or Checkr came back with possible
 * matches. One strike: no retry path. Both gates (`useVerificationGate`,
 * `resolveVerifyIdentityRoute`) and the home tab (`useBuzzTab`) all read
 * through this so the rule lives in one place.
 *
 * `Failed` and `Expired` Persona statuses are deliberately *not* included —
 * those are transient (technical failure / inquiry timeout) and stay
 * retryable through `IdentityDeclinedSection`.
 */
export const isVerificationDenied = (
  user: AuthUser | null | undefined,
): boolean => {
  if (!user) {
    return false;
  }

  if (user.backgroundCheckBadge === BackgroundCheckBadge.Denied) {
    return true;
  }

  if (user.identityVerificationStatus === IdentityVerificationStatus.Declined) {
    return true;
  }

  return false;
};

/**
 * True when the user has live progress in the verification flow that we'd
 * want to surface as "Resume" rather than "Get Started":
 * - They've paid (`isPro`)
 * - They don't yet have a finished badge
 * - Persona is actively in flight or already approved (so Checkr is the
 *   remaining step)
 *
 * Excludes Declined/Failed/Expired — those are functionally a fresh start,
 * even though the user did try once.
 */
export const hasResumableVerification = ({
  user,
  isPro,
}: ResolveInput): boolean => {
  if (!user || !isPro) {
    return false;
  }

  if (isVerificationDenied(user)) {
    return false;
  }

  if (user.backgroundCheckBadge !== BackgroundCheckBadge.None) {
    return false;
  }

  return RESUMABLE_STATUSES.has(user.identityVerificationStatus);
};

/**
 * Picks the route a user should land on when re-entering the verification
 * flow from outside (e.g. home "Get Started"). Returns `null` when the user
 * has already finished — callers should hide the entry affordance.
 *
 * Why: paying once and abandoning the flow halfway shouldn't drop the user
 * back at the paywall. They've already paid, so we resume them at the
 * consolidated flow screen, which self-derives the right phase
 * (kickoff/waiting/declined for pre-Persona, criminal-intro/criminal-form
 * for post-Persona) from the user's status.
 */
export const resolveVerifyIdentityRoute = ({
  user,
  isPro,
}: ResolveInput): VerifyIdentityRoute | null => {
  if (!user) {
    return '/verify-identity';
  }

  // Terminal denial (Persona Declined or Checkr Denied) hides the entry CTA
  // entirely — the home tab's denied flow takes over from here.
  if (isVerificationDenied(user)) {
    return null;
  }

  if (user.backgroundCheckBadge !== BackgroundCheckBadge.None) {
    return null;
  }

  if (!isPro) {
    return '/verify-identity';
  }

  return '/verify-identity/identity';
};
