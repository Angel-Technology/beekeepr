import { Fragment } from 'react';
import { View } from 'react-native';
import { CompactButton, FormCard } from '@components';
import { InfoSection } from '@src/features/account';
import type { Invite } from '../../../models/home.types';
import { BuzzConnectionRow } from '../connections/BuzzConnectionRow';

type BuzzSentInvitesCardProps = {
  invites: readonly Invite[];
  onCancel: (otherUserId: string) => void;
  onPressInvite?: (invite: Invite) => void;
  cancelPendingId: string | null;
};

export const BuzzSentInvitesCard = ({
  invites,
  onCancel,
  onPressInvite,
  cancelPendingId,
}: BuzzSentInvitesCardProps) => {
  // No empty state — when the user has no sent invites the whole section
  // disappears. Lets the caller mount unconditionally without having to
  // gate on `invites.length`.
  if (invites.length === 0) {
    return null;
  }

  return (
    <InfoSection title="SENT INVITES">
      <FormCard className="gap-0 px-5 py-2">
        {invites.map((invite, index) => (
          <Fragment key={invite.id}>
            {index > 0 ? (
              <View className="bg-tk-border-secondary h-px w-full" />
            ) : null}
            <BuzzConnectionRow
              nickname={invite.nickname ?? ''}
              handle={invite.handle ?? ''}
              imageUrl={invite.imageUrl}
              onPress={onPressInvite ? () => onPressInvite(invite) : undefined}
              trailing={
                <CompactButton
                  label="Unsend"
                  variant="outline"
                  loading={cancelPendingId === invite.id}
                  onPress={() => onCancel(invite.id)}
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
