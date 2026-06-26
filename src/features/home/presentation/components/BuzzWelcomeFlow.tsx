import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type {
  BlockedUser,
  Connection,
  Invite,
} from '../../models/home.types';
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
  return (
    <View className="w-full gap-7">
      {isOnTrial && trialDaysRemaining !== null ? (
        <BuzzTrialCountdownCard daysRemaining={trialDaysRemaining} />
      ) : null}

      <BuzzConnectionPill active={activeTab} onChange={onChangeTab} />

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
            onCancel={onCancelInvite}
            onPressInvite={onPressSentInvite}
            cancelPendingId={cancelPendingId}
          />
          <BuzzBlockedUsersCard
            blockedUsers={blockedUsers}
            onUnblock={onUnblockUser}
            onPressBlockedUser={onPressBlockedUser}
            unblockPendingId={unblockPendingId}
          />
        </Animated.View>
      )}
    </View>
  );
};
