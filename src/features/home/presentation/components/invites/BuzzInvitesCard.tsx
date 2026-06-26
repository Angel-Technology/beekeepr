import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { CompactButton, FormCard } from '@components';
import { InfoSection } from '@src/features/account';
import type { Invite } from '../../../models/home.types';
import { BuzzConnectionRow } from '../connections/BuzzConnectionRow';

type BuzzInvitesCardProps = {
  invites: readonly Invite[];
  onAccept: (otherUserId: string) => void;
  onDecline: (otherUserId: string) => void;
  onPressInvite?: (invite: Invite) => void;
  acceptPendingId: string | null;
  declinePendingId: string | null;
};

type InviteRowActionsProps = {
  isAcceptPending: boolean;
  isDeclinePending: boolean;
  onAccept: () => void;
  onDecline: () => void;
  disabled?: boolean;
};

const NOOP = () => undefined;

// Compact two-button cluster lives in the row's `trailing` slot. Buttons
// disable each other while either mutation is in flight so a row can't
// fire accept + decline in rapid succession.
const InviteRowActions = ({
  isAcceptPending,
  isDeclinePending,
  onAccept,
  onDecline,
  disabled = false,
}: InviteRowActionsProps) => {
  const isAnyPending = isAcceptPending || isDeclinePending;
  return (
    <View className="flex-row items-center gap-2">
      <CompactButton
        label="Decline"
        variant="outline"
        loading={isDeclinePending}
        disabled={disabled || (isAnyPending && !isDeclinePending)}
        onPress={onDecline}
        className="min-h-0 self-auto px-4 py-2"
        textClassName="text-sm"
      />
      <CompactButton
        label="Approve"
        variant="solid"
        loading={isAcceptPending}
        disabled={disabled || (isAnyPending && !isAcceptPending)}
        onPress={onAccept}
        className="min-h-0 self-auto px-4 py-2"
        textClassName="text-sm"
      />
    </View>
  );
};

export const BuzzInvitesCard = ({
  invites,
  onAccept,
  onDecline,
  onPressInvite,
  acceptPendingId,
  declinePendingId,
}: BuzzInvitesCardProps) => {
  const isEmpty = invites.length === 0;

  return (
    <InfoSection title="INBOX">
      {isEmpty ? (
        <FormCard className="gap-3 p-3">
          <Text className="text-tk-text-primary px-4 pb-4 pt-2 font-lexend-regular text-sm">
            Manage Buzz Badge member invites here.
          </Text>
          <BuzzConnectionRow
            nickname="Member"
            handle="member"
            muted
            trailing={
              <InviteRowActions
                isAcceptPending={false}
                isDeclinePending={false}
                onAccept={NOOP}
                onDecline={NOOP}
                disabled
              />
            }
            className="bg-tk-bg-elevated-secondary rounded-3 border-0 px-5"
          />
        </FormCard>
      ) : (
        <FormCard className="gap-0 px-6 py-2">
          {invites.map((invite, index) => (
            <Fragment key={invite.id}>
              {index > 0 ? (
                <View className="bg-tk-border-secondary h-px w-full" />
              ) : null}
              <BuzzConnectionRow
                nickname={invite.nickname ?? ''}
                handle={invite.handle ?? ''}
                imageUrl={invite.imageUrl}
                onPress={
                  onPressInvite ? () => onPressInvite(invite) : undefined
                }
                trailing={
                  <InviteRowActions
                    isAcceptPending={acceptPendingId === invite.id}
                    isDeclinePending={declinePendingId === invite.id}
                    onAccept={() => onAccept(invite.id)}
                    onDecline={() => onDecline(invite.id)}
                  />
                }
                className="rounded-none border-0 bg-transparent py-5"
              />
            </Fragment>
          ))}
        </FormCard>
      )}
    </InfoSection>
  );
};
