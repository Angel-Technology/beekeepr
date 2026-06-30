import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useConfirmDestructive } from '@components';
import type { BlockedUser, Connection, Invite } from '../../models/home.types';
import {
  BuzzConnectionPill,
  BuzzConnectionsCard,
  type ConnectionTab,
} from './connections';
import {
  BuzzBlockedUsersCard,
  BuzzInvitesCard,
  BuzzSentInvitesCard,
} from './invites';
import { BuzzTrialCountdownCard } from './BuzzTrialCountdownCard';

const CONFIRM_UNSEND = {
  title: 'Unsend invite?',
  description:
    "They won't see your invite anymore. You can send a new one later.",
  confirmLabel: 'Unsend',
} as const;

const CONFIRM_UNBLOCK = {
  title: 'Unblock user?',
  description:
    "They'll be able to send invites and see your profile again. You can re-block them from the drawer at any time.",
  confirmLabel: 'Unblock',
} as const;

type BuzzWelcomeFlowProps = {
  connections: readonly Connection[];
  invites: readonly Invite[];
  sentInvites: readonly Invite[];
  blockedUsers: readonly BlockedUser[];
  isOnTrial: boolean;
  trialDaysRemaining: number | null;
  activeTab: ConnectionTab;
  onChangeTab: (next: ConnectionTab) => void;
  onAcceptInvite: (otherUserId: string) => void;
  onDeclineInvite: (otherUserId: string) => void;
  onCancelInvite: (otherUserId: string) => void;
  onUnblockUser: (targetUserId: string) => void;
  onPressConnection: (connection: Connection) => void;
  onPressInvite: (invite: Invite) => void;
  onPressSentInvite: (invite: Invite) => void;
  onPressBlockedUser: (blockedUser: BlockedUser) => void;
  acceptPendingId: string | null;
  declinePendingId: string | null;
  cancelPendingId: string | null;
  unblockPendingId: string | null;
};

const ENTER = FadeIn.duration(180);
const EXIT = FadeOut.duration(120);

export const BuzzWelcomeFlow = ({
  connections,
  invites,
  sentInvites,
  blockedUsers,
  isOnTrial,
  trialDaysRemaining,
  activeTab,
  onChangeTab,
  onAcceptInvite,
  onDeclineInvite,
  onCancelInvite,
  onUnblockUser,
  onPressConnection,
  onPressInvite,
  onPressSentInvite,
  onPressBlockedUser,
  acceptPendingId,
  declinePendingId,
  cancelPendingId,
  unblockPendingId,
}: BuzzWelcomeFlowProps) => {
  const confirm = useConfirmDestructive();

  // Gate the two row-level destructive actions through the shared
  // confirm modal. Accept / Decline stay immediate — Approve is
  // constructive and Decline is the user's intended action on a
  // received invite (re-declining is cheap), so the prompt would just
  // add friction.
  const handleCancelInvite = async (otherUserId: string) => {
    const ok = await confirm(CONFIRM_UNSEND);
    if (!ok) {
      return;
    }
    onCancelInvite(otherUserId);
  };

  const handleUnblockUser = async (targetUserId: string) => {
    const ok = await confirm(CONFIRM_UNBLOCK);
    if (!ok) {
      return;
    }
    onUnblockUser(targetUserId);
  };

  return (
    <View className="w-full gap-7">
      {isOnTrial && trialDaysRemaining !== null ? (
        <BuzzTrialCountdownCard daysRemaining={trialDaysRemaining} />
      ) : null}

      <BuzzConnectionPill
        active={activeTab}
        onChange={onChangeTab}
        inviteCount={invites.length}
      />

      {activeTab === 'connections' ? (
        <Animated.View
          key="connections"
          entering={ENTER}
          exiting={EXIT}
          className="w-full gap-7"
        >
          <BuzzConnectionsCard
            connections={connections}
            onPressConnection={onPressConnection}
          />
        </Animated.View>
      ) : (
        <Animated.View
          key="invites"
          entering={ENTER}
          exiting={EXIT}
          className="w-full gap-7"
        >
          <BuzzInvitesCard
            invites={invites}
            onAccept={onAcceptInvite}
            onDecline={onDeclineInvite}
            onPressInvite={onPressInvite}
            acceptPendingId={acceptPendingId}
            declinePendingId={declinePendingId}
          />
          <BuzzSentInvitesCard
            invites={sentInvites}
            onCancel={handleCancelInvite}
            onPressInvite={onPressSentInvite}
            cancelPendingId={cancelPendingId}
          />
          <BuzzBlockedUsersCard
            blockedUsers={blockedUsers}
            onUnblock={handleUnblockUser}
            onPressBlockedUser={onPressBlockedUser}
            unblockPendingId={unblockPendingId}
          />
        </Animated.View>
      )}
    </View>
  );
};
