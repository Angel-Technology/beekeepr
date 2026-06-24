import { Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ChevronRight, UserRound } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

type ProfilePreviewCardProps = {
  nickname: string;
  handle: string;
  imageUrl?: string | null;
  onPress?: () => void;
};

const AVATAR_SIZE = 44;

const formatHandle = (handle: string) => {
  const trimmed = handle.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

export const ProfilePreviewCard = ({
  nickname,
  handle,
  imageUrl,
  onPress,
}: ProfilePreviewCardProps) => {
  const displayedHandle = formatHandle(handle);
  const avatarIconColor = useThemedColor(themedColors.text.tertiary);
  const chevronColor = useThemedColor(themedColors.text.primary);
  const hasAvatar = Boolean(imageUrl && imageUrl.length > 0);
  const isPressable = Boolean(onPress);
  const Container = isPressable ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className="border-tk-border-secondary bg-tk-bg-primary w-full flex-row items-center gap-3 rounded-5 border p-4"
    >
      <View className="bg-tk-bg-elevated-secondary size-[44px] items-center justify-center overflow-hidden rounded-round">
        {hasAvatar && imageUrl ? (
          <SvgUri uri={imageUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        ) : (
          <UserRound size={24} color={avatarIconColor} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="text-tk-text-primary font-lexend-semiBold text-base"
          numberOfLines={1}
        >
          {nickname || ''}
        </Text>
        {displayedHandle ? (
          <Text
            className="text-tk-text-secondary font-lexend-regular text-footnote"
            numberOfLines={1}
          >
            {displayedHandle}
          </Text>
        ) : null}
      </View>
      {onPress ? <ChevronRight size={24} color={chevronColor} /> : null}
    </Container>
  );
};
