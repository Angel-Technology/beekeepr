import {
  BackgroundCheckBadge,
  IdentityVerificationStatus,
  type AuthUser,
} from '@features/auth';

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
 * matches. One strike: no retry path.
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
 * want to surface as "Resume" rather than "Get Started" — they've kicked off
 * Persona but haven't reached a terminal badge yet.
 */
export const hasResumableVerification = (
  user: AuthUser | null | undefined,
): boolean => {
  if (!user) {
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
