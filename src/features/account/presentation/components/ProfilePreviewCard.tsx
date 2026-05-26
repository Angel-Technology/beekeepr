import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { User } from 'lucide-react-native';

type ProfilePreviewCardProps = {
  nickname: string;
  handle: string;
  imageUrl?: string | null;
  joinedDate?: string;
};

const AVATAR_SIZE = 44;

const formatHandle = (handle: string) => {
  const trimmed = handle.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

/**
 * Pull the first grapheme cluster from the nickname so multi-codepoint
 * emoji (ZWJ sequences, flags, skin tone) render as one glyph instead of
 * being chopped mid-codepoint. Falls back to the first character of the
 * trimmed string when `Intl.Segmenter` isn't available on the engine.
 */
const firstGrapheme = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return '';
  }
  const Segmenter =
    typeof Intl !== 'undefined'
      ? (Intl as { Segmenter?: typeof Intl.Segmenter }).Segmenter
      : undefined;
  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: 'grapheme' });
    const iterator = segmenter.segment(trimmed)[Symbol.iterator]();
    const next = iterator.next();
    if (!next.done) {
      return next.value.segment;
    }
  }
  return Array.from(trimmed)[0] ?? '';
};

export const ProfilePreviewCard = ({
  nickname,
  handle,
  imageUrl,
}: ProfilePreviewCardProps) => {
  const displayedHandle = formatHandle(handle);
  const fallbackGrapheme = firstGrapheme(nickname);

  return (
    <View className="w-full flex-row items-center gap-5 rounded-5 border border-border-weak bg-bg-default p-5">
      <View className="size-[44px] items-center justify-center overflow-hidden rounded-round bg-brand-primary">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          />
        ) : fallbackGrapheme.length > 0 ? (
          <Text
            className="font-lexend-semiBold text-base leading-6 text-text-default"
            allowFontScaling={false}
          >
            {fallbackGrapheme}
          </Text>
        ) : (
          <User size={22} color="#000000" />
        )}
      </View>
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="font-lexend-semiBold text-base leading-6 text-text-default"
            numberOfLines={1}
          >
            {nickname || 'Your name'}
          </Text>
          {displayedHandle ? (
            <Text
              className="font-lexend-regular text-footnote leading-200 text-text-secondary"
              numberOfLines={1}
            >
              {displayedHandle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};
