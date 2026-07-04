import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { UserRound } from 'lucide-react-native';
import {
  cn,
  isRenderableAvatarUrl,
  themedColors,
  useThemedColor,
} from '@common';

type BuzzConnectionRowProps = {
  nickname: string;
  handle: string;
  imageUrl?: string | null;
  // Right-side slot — typically the Buzz Badge crest, but any node is
  // accepted so callers can render verification status, flags, action
  // pills, etc. without a new prop per use case.
  trailing?: ReactNode;
  // Renders the nickname + handle in `text-tk-text-tertiary` (50% opacity)
  // for placeholder rows in the empty-state card. Real connection rows
  // leave this off so the text reads at full contrast.
  muted?: boolean;
  onPress?: () => void;
  className?: string;
};

const AVATAR_SIZE = 48;

const formatHandle = (handle: string) => {
  const trimmed = handle.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

export const BuzzConnectionRow = ({
  nickname,
  handle,
  imageUrl,
  trailing,
  muted = false,
  onPress,
  className,
}: BuzzConnectionRowProps) => {
  const displayedHandle = formatHandle(handle);
  const avatarIconColor = useThemedColor(themedColors.text.tertiary);
  // Drop Google / Apple `picture` URLs the backend stores on social
  // sign-in — those are raster and crash `SvgUri` mid-render.
  const hasAvatar = isRenderableAvatarUrl(imageUrl);
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className={cn(
        'w-full flex-row items-center gap-3 rounded-4 border border-tk-border-secondary bg-tk-bg-primary px-1 py-4',
        className,
      )}
    >
      <View className="size-[44px] items-center justify-center overflow-hidden rounded-round bg-tk-bg-elevated-tertiary">
        {hasAvatar ? (
          <SvgUri uri={imageUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        ) : (
          <UserRound size={24} color={avatarIconColor} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className={cn(
            'font-lexend-semiBold text-lg',
            muted ? 'text-tk-text-tertiary' : 'text-tk-text-primary',
          )}
          numberOfLines={1}
        >
          {nickname || ''}
        </Text>
        {displayedHandle ? (
          <Text
            className={cn(
              'font-lexend-regular text-footnote',
              muted ? 'text-tk-text-tertiary' : 'text-tk-text-secondary',
            )}
            numberOfLines={1}
          >
            {displayedHandle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Container>
  );
};
