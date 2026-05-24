import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BackgroundCheckBadge,
  IdentityVerificationStatus,
  authQueryKeys,
  authService,
  useAuthSession,
} from '@features/auth';
import type { VerificationPhase } from '../models/verification.types';
import { useVerificationActions } from './useVerificationActions';

const POLL_INTERVAL_MS = 2000;
// 15 polls × 2s ≈ 30s of waiting before we declare timed-out. Counting
// polls instead of wall time keeps everything driven by the query lifecycle
// — no `setTimeout`, no separate tick source.
const POLL_TIMEOUT_COUNT = 15;

type IdentityBaseline =
  | 'kickoff'
  | 'waiting'
  | 'needs-review'
  | 'declined'
  | 'approved';

const identityBaseline = (
  status: IdentityVerificationStatus,
): IdentityBaseline => {
  switch (status) {
    case IdentityVerificationStatus.Approved:
      return 'approved';
    case IdentityVerificationStatus.Declined:
    case IdentityVerificationStatus.Failed:
    case IdentityVerificationStatus.Expired:
      return 'declined';
    // `Created` means the backend minted the inquiry but the user never
    // submitted it; `Pending` means they started Persona and bailed before
    // finishing. Both should drop the user back at kickoff so they can
    // relaunch and complete the flow against the existing inquiry.
    case IdentityVerificationStatus.Created:
    case IdentityVerificationStatus.Pending:
      return 'kickoff';
    // `Completed` is a transient post-submission state — Persona always
    // follows it with one of the terminal events. Keep polling.
    case IdentityVerificationStatus.Completed:
      return 'waiting';
    // `NeedsReview` means a human has to look at the inquiry. That can take
    // hours or days, so it gets its own screen instead of a spinner.
    case IdentityVerificationStatus.NeedsReview:
      return 'needs-review';
    case IdentityVerificationStatus.NotStarted:
    default:
      return 'kickoff';
  }
};

/**
 * Drives the consolidated verification flow screen. Every post-paywall step
 * lives under one URL and one screen body; this hook owns the phase machine
 * that decides which body section renders.
 *
 * Responsibilities:
 * - Derive `phase` from `user.identityVerificationStatus` plus a local
 *   `criminalIntroAcknowledged` flag. There's no `approved` phase in the
 *   public union — when status flips to Approved we drop straight into
 *   `criminal-intro` (which the user advances by tapping "Start search").
 * - Poll `currentUser` every 2s while `phase === 'waiting'`; flip to
 *   `timed-out` after `POLL_TIMEOUT_COUNT` polls. Polling stops the moment
 *   we leave waiting.
 * - Expose `handleStartVerification` (Persona SDK launch) and
 *   `handleStartCriminalSearch` (intro → form transition).
 *
 * Why one hook for the whole flow: the post-paywall steps are a state
 * machine, not separate screens. Splitting them across hooks/screens forced
 * coordination via routing (`router.replace` between steps), which made the
 * exit-modal and back-button behaviour brittle. With one hook the
 * transitions are pure data and there's no programmatic navigation between
 * sections to fight with `usePreventRemove`.
 */
export const useVerificationFlow = () => {
  const { data: user } = useAuthSession();
  const { startPersonaVerification } = useVerificationActions();
  const [criminalIntroAcknowledged, setCriminalIntroAcknowledged] =
    useState(false);

  const status =
    user?.identityVerificationStatus ?? IdentityVerificationStatus.NotStarted;
  const badge = user?.backgroundCheckBadge ?? BackgroundCheckBadge.None;
  const rawBaseline = identityBaseline(status);

  // The SDK's `onComplete` resolves our mutation, but the backend only
  // learns the inquiry is done via Persona's webhook — there's a real race
  // where status is still `Created`/`Pending` for a few seconds after the
  // user submits. Without this, `Created → kickoff` (intentional, so users
  // can resume abandoned inquiries) bounces them right back to the kickoff
  // screen the moment they finish; tapping "Start verification" again then
  // 409s from Persona's `/resume` because the inquiry is already approved.
  const isAwaitingWebhook =
    startPersonaVerification.isSuccess &&
    (status === IdentityVerificationStatus.Created ||
      status === IdentityVerificationStatus.Pending);

  const baseline: IdentityBaseline = isAwaitingWebhook
    ? 'waiting'
    : rawBaseline;

  // React "reset state during render" pattern — when the underlying
  // identity status changes, drop any stale poll-count and intro-ack so a
  // re-entry into the flow starts fresh.
  const [trackedBaseline, setTrackedBaseline] = useState(baseline);
  const [pollCount, setPollCount] = useState(0);
  if (trackedBaseline !== baseline) {
    setTrackedBaseline(baseline);
    setPollCount(0);
    if (baseline !== 'approved') {
      setCriminalIntroAcknowledged(false);
    }
  }

  const isTimedOut = baseline === 'waiting' && pollCount >= POLL_TIMEOUT_COUNT;

  const phase: VerificationPhase = (() => {
    // Background-check badge wins over identity phase — once Checkr has come
    // back (Approved/Denied), the user is past the identity flow and the
    // congrats / denied section takes over.
    if (badge === BackgroundCheckBadge.Approved) {
      return 'congrats';
    }
    if (badge === BackgroundCheckBadge.Denied) {
      return 'denied';
    }
    if (baseline === 'approved') {
      return criminalIntroAcknowledged ? 'criminal-form' : 'criminal-intro';
    }
    if (baseline === 'waiting' && isTimedOut) {
      return 'timed-out';
    }
    return baseline;
  })();

  useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: async () => {
      if (baseline === 'waiting') {
        setPollCount((n) => n + 1);
      }
      return authService.getCurrentUser();
    },
    refetchInterval: () => (phase === 'waiting' ? POLL_INTERVAL_MS : false),
    staleTime: 0,
  });

  const handleStartVerification = async () => {
    await startPersonaVerification.mutateAsync().catch(() => {
      // `onError` on the mutation already surfaces the failure via Alert.
    });
  };

  return {
    phase,
    isStarting: startPersonaVerification.isPending,
    handleStartVerification,
    handleStartCriminalSearch: () => setCriminalIntroAcknowledged(true),
  };
};
