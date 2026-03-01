import { Text, View } from 'react-native';

import type { OnboardingSlideSubtitle } from './OnboardingSlideCard';

type OnboardingSlideSubtitleSectionProps = {
  subtitle?: OnboardingSlideSubtitle;
};

export const OnboardingSlideSubtitleSection = ({
  subtitle,
}: OnboardingSlideSubtitleSectionProps) => {
  if (!subtitle) {
    return null;
  }

  return (
    <View className="flex flex-col items-start gap-1 self-stretch">
      {subtitle.header ? (
        <Text className="self-stretch font-sourceSans-semiBold text-400 text-text-default">
          {subtitle.header}
        </Text>
      ) : null}
      {subtitle.body ? (
        <Text className="font-sourceSans-regular text-400 text-text-secondary">
          {subtitle.body}
        </Text>
      ) : null}
      {subtitle.list ? (
        <View className="gap-1 pl-sm">
          {subtitle.list.map((item) => (
            <View key={item} className="flex-row gap-2">
              <Text className="font-sourceSans-regular text-400 text-text-secondary">
                •
              </Text>
              <Text className="font-sourceSans-regular text-400 text-text-secondary">
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};
