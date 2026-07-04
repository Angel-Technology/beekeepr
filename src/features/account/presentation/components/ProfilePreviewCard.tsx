import { Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ChevronRight, UserRound } from 'lucide-react-native';

import { isRenderableAvatarUrl, themedColors, useThemedColor } from '@common';

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
  // Reject Google / Apple `picture` URLs the backend stores on social
  // sign-in — those are raster and `SvgUri` crashes on them.
  const hasAvatar = isRenderableAvatarUrl(imageUrl);
  const isPressable = Boolean(onPress);
  const Container = isPressable ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className="w-full flex-row items-center gap-3 rounded-5 border border-tk-border-secondary bg-tk-bg-primary p-4"
    >
      <View className="size-[44px] items-center justify-center overflow-hidden rounded-round bg-tk-bg-elevated-secondary">
        {hasAvatar ? (
          <SvgUri uri={imageUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        ) : (
          <UserRound size={24} color={avatarIconColor} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="font-lexend-semiBold text-base text-tk-text-primary"
          numberOfLines={1}
        >
          {nickname || ''}
        </Text>
        {displayedHandle ? (
          <Text
            className="font-lexend-regular text-footnote text-tk-text-secondary"
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
