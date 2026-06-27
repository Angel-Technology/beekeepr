import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useRedeemPromoCode } from '@features/account/hooks/useRedeemPromoCode';
import { authQueryKeys, BackgroundCheckBadge, useAuthSession } from '@features/auth';
import {
  hasResumableVerification,
  isVerificationDenied,
} from '@features/verification';
import { useTrialPurchase } from '@features/verification/hooks/useTrialPurchase';
import { useRevenueCat } from '@src/lib/revenuecat';
import type { ConnectionTab } from '../presentation/components/connections';
import type { BuzzFlow } from '../models/buzzFlow.types';
import { homeQueryKeys } from '../models/homeQueryKeys';
import type { BlockedUser, Connection, Invite } from '../models/home.types';
import { useBlockedUsers } from './useBlockedUsers';
import { useCancelInvite } from './useCancelInvite';
import { useConnections } from './useConnections';
import { useIncomingInvites } from './useIncomingInvites';
import { useOpenProfilePreview } from './useOpenProfilePreview';
import { useOutgoingInvites } from './useOutgoingInvites';
import { useRespondToInvite } from './useRespondToInvite';
import { useUnblockUser } from './useUnblockUser';

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
 *   (`isPro`) — the connections home.
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
  const queryClient = useQueryClient();
  const { data: user, isPending: isUserPending } = useAuthSession();
  const {
    isReady: isRevenueCatReady,
    isPro,
    isLapsed,
    isOnTrial,
    trialDaysRemaining,
  } = useRevenueCat();
  const { isPurchasing, startTrial } = useTrialPurchase();
  const { data: connections } = useConnections();
  const { data: invites } = useIncomingInvites();
  const { data: sentInvites } = useOutgoingInvites();
  const { data: blockedUsers } = useBlockedUsers();
  const {
    accept: acceptInvite,
    decline: declineInvite,
    acceptPendingId,
    declinePendingId,
  } = useRespondToInvite();
  const { cancel: cancelInvite, cancelPendingId } = useCancelInvite();
  const { unblock: unblockUser, unblockPendingId } = useUnblockUser();
  const openProfilePreview = useOpenProfilePreview();

  // Bound preview-opener per source so cards can stay dumb (don't have
  // to know what `PreviewSource` is). Each variant just calls the right
  // string on the way through.
  const onPressConnection = (connection: Connection) =>
    openProfilePreview(connection, 'connection');
  const onPressInvite = (invite: Invite) =>
    openProfilePreview(invite, 'invite');
  const onPressSentInvite = (invite: Invite) =>
    openProfilePreview(invite, 'sent-invite');
  const onPressBlockedUser = (blockedUser: BlockedUser) =>
    openProfilePreview(blockedUser, 'blocked');

  // Pill state is owned at the orchestration layer so the active tab can
  // be reset alongside other welcome-flow state if/when we ever need to.
  const [activeConnectionTab, setActiveConnectionTab] =
    useState<ConnectionTab>('connections');

  // Pull-to-refresh on the Buzz tab. Invalidates every cache the screen
  // reads off so the badge crest, connections, both invite directions,
  // and the blocked list all round-trip. Returns a Promise that
  // resolves when every refetch lands so `RefreshControl` can drop the
  // spinner at the right moment.
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.session() }),
        queryClient.invalidateQueries({ queryKey: homeQueryKeys.connections() }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.incomingInvites(),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.outgoingInvites(),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.blockedUsers(),
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

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
    isRefreshing,
    onRefresh,
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
      connections: connections ?? [],
      invites: invites ?? [],
      sentInvites: sentInvites ?? [],
      blockedUsers: blockedUsers ?? [],
      isOnTrial,
      trialDaysRemaining,
      activeTab: activeConnectionTab,
      onChangeTab: setActiveConnectionTab,
      onAcceptInvite: acceptInvite,
      onDeclineInvite: declineInvite,
      onCancelInvite: cancelInvite,
      onUnblockUser: unblockUser,
      onPressConnection,
      onPressInvite,
      onPressSentInvite,
      onPressBlockedUser,
      acceptPendingId,
      declinePendingId,
      cancelPendingId,
      unblockPendingId,
    },
  };
};
