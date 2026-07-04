import { Fragment } from 'react';
import { View } from 'react-native';
import { CompactButton, FormCard } from '@components';
import { InfoSection } from '@src/features/account';
import type { BlockedUser } from '../../../models/home.types';
import { BuzzConnectionRow } from '../connections/BuzzConnectionRow';

type BuzzBlockedUsersCardProps = {
  blockedUsers: readonly BlockedUser[];
  onUnblock: (targetUserId: string) => void;
  onPressBlockedUser?: (user: BlockedUser) => void;
  unblockPendingId: string | null;
};

export const BuzzBlockedUsersCard = ({
  blockedUsers,
  onUnblock,
  onPressBlockedUser,
  unblockPendingId,
}: BuzzBlockedUsersCardProps) => {
  // No empty state — when nobody is blocked, the whole section
  // disappears. Matches the BuzzSentInvitesCard pattern.
  if (blockedUsers.length === 0) {
    return null;
  }

  return (
    <InfoSection title="BLOCKED">
      <FormCard className="gap-0 px-5 py-2">
        {blockedUsers.map((user, index) => (
          <Fragment key={user.id}>
            {index > 0 ? (
              <View className="bg-tk-border-secondary h-px w-full" />
            ) : null}
            <BuzzConnectionRow
              nickname={user.nickname ?? ''}
              handle={user.handle ?? ''}
              imageUrl={user.imageUrl}
              onPress={
                onPressBlockedUser ? () => onPressBlockedUser(user) : undefined
              }
              trailing={
                <CompactButton
                  label="Unblock"
                  variant="outline"
                  loading={unblockPendingId === user.id}
                  onPress={() => onUnblock(user.id)}
                  className="min-h-0 self-auto px-4 py-2"
                  textClassName="text-sm"
                />
              }
              className="rounded-none border-0 bg-transparent py-5"
            />
          </Fragment>
        ))}
      </FormCard>
    </InfoSection>
  );
};
