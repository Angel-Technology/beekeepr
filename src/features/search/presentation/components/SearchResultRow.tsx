import { X } from 'lucide-react-native';
import { CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { BackgroundCheckBadge } from '@features/auth';
import BuzzBadge from '@assets/svg/BuzzBadge';
import BuzzBadgeMuted from '@assets/svg/BuzzBadgeMuted';
import { BuzzConnectionRow } from '@features/home/presentation/components/connections/BuzzConnectionRow';
import {
  ViewerFriendshipState,
  type SearchResultUser,
} from '../../models/search.types';

type SearchResultRowProps = {
  user: SearchResultUser;
  onPress: (user: SearchResultUser) => void;
  onUnsendInvite: (userId: string) => void;
  isUnsending: boolean;
};

export const SearchResultRow = ({
  user,
  onPress,
  onUnsendInvite,
  isUnsending,
}: SearchResultRowProps) => {
  const mutedBadgeColor = useThemedColor(themedColors.text.tertiary);
  const iconColor = useThemedColor(themedColors.text.primary);

  const isRequestSent =
    user.viewerFriendshipState === ViewerFriendshipState.RequestSent;
  const isApproved =
    user.backgroundCheckBadge === BackgroundCheckBadge.Approved;

  const trailing = isRequestSent ? (
    <CompactButton
      label="Unsend"
      variant="outline"
      iconLeft={<X size={16} strokeWidth={2.2} color={iconColor} />}
      loading={isUnsending}
      onPress={() => onUnsendInvite(user.id)}
      className="min-h-0 self-auto px-3 py-2"
      textClassName="text-sm"
    />
  ) : isApproved ? (
    <BuzzBadge width={21} height={24} />
  ) : (
    <BuzzBadgeMuted color={mutedBadgeColor} />
  );

  return (
    <BuzzConnectionRow
      nickname={user.nickname ?? ''}
      handle={user.handle ?? ''}
      imageUrl={user.imageUrl}
      trailing={trailing}
      onPress={() => onPress(user)}
      className="rounded-none border-0 bg-transparent py-4"
    />
  );
};
