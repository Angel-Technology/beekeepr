import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { FormCard } from '@components';
import { themedColors, useThemedColor } from '@common';
import { InfoSection } from '@src/features/account';
import BuzzBadge from '@src/assets/svg/BuzzBadge';
import BuzzBadgeMuted from '@src/assets/svg/BuzzBadgeMuted';
import type { Connection } from '../../../models/home.types';
import { BuzzConnectionRow } from './BuzzConnectionRow';

type BuzzConnectionsCardProps = {
  connections: readonly Connection[];
};

export const BuzzConnectionsCard = ({
  connections,
}: BuzzConnectionsCardProps) => {
  const mutedBadgeColor = useThemedColor(themedColors.text.tertiary);
  const isEmpty = connections.length === 0;

  return (
    <InfoSection title="MY BUZZ BADGE CONNECTIONS">
      {isEmpty ? (
        <FormCard className="gap-3 p-3">
          <Text className="text-tk-text-primary px-4 pb-4 pt-2 font-lexend-regular text-sm leading-5">
            Keep track of your Buzz Badge connections here. You can add, remove
            and flag people.
          </Text>
          <BuzzConnectionRow
            nickname="Member"
            handle="member"
            muted
            trailing={<BuzzBadgeMuted color={mutedBadgeColor} />}
            className="bg-tk-bg-elevated-secondary rounded-3 border-0 px-5"
          />
        </FormCard>
      ) : (
        <FormCard className="gap-0 px-6 py-2">
          {connections.map((connection, index) => (
            <Fragment key={connection.id}>
              {index > 0 ? (
                <View className="bg-tk-border-secondary h-px w-full" />
              ) : null}
              <BuzzConnectionRow
                nickname={connection.nickname ?? ''}
                handle={connection.handle ?? ''}
                imageUrl={connection.imageUrl}
                trailing={<BuzzBadge width={21} height={24} />}
                className="rounded-none border-0 bg-transparent py-5"
              />
            </Fragment>
          ))}
        </FormCard>
      )}
    </InfoSection>
  );
};
