import { Pressable, Text, View } from 'react-native';
import { ChevronRight, UserRound } from 'lucide-react-native';

const AVATAR_BG = '#1489E6';

type ProfilePreviewCardProps = {
  nickname: string;
  handle: string;
  onPress?: () => void;
};

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
  onPress,
}: ProfilePreviewCardProps) => {
  const displayedHandle = formatHandle(handle);
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="w-full flex-row items-center gap-3 rounded-5 border border-border-weak bg-bg-default p-4"
    >
      <View
        className="size-[44px] items-center justify-center rounded-round"
        style={{ backgroundColor: AVATAR_BG }}
      >
        <UserRound size={24} color="#FFFFFF" />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          className="font-lexend-semiBold text-base text-text-default"
          numberOfLines={1}
        >
          {nickname || ''}
        </Text>
        {displayedHandle ? (
          <Text
            className="font-lexend-regular text-footnote text-text-secondary"
            numberOfLines={1}
          >
            {displayedHandle}
          </Text>
        ) : null}
      </View>
      {onPress ? <ChevronRight size={24} color="#000000" /> : null}
    </Container>
  );
};
