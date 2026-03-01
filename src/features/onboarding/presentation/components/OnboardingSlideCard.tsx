import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { AppImageSource } from '@assets/images';
import { DetailCard } from '@components';
import { OnboardingSlideSubtitleSection } from './OnboardingSlideSubtitleSection';

export type OnboardingSlideSubtitle = {
  header?: string;
  body?: string;
  list?: string[];
};

type OnboardingSlideCardProps = {
  title: string;
  titleIcon?: AppImageSource;
  subtitle?: OnboardingSlideSubtitle;
  image: ReactNode;
  detailTitle: string;
  detailItems: string[];
};
export const OnboardingSlideCard = ({
  title,
  titleIcon,
  subtitle,
  image,
  detailTitle,
  detailItems,
}: OnboardingSlideCardProps) => {
  return (
    <View className="flex-1 flex-col items-center gap-6 self-stretch rounded-5 border border-border-weak p-5">
      <View className="flex flex-row items-start justify-center gap-1 self-stretch">
        <Text className="text-center font-poppins-semiBold text-500 leading-400 text-text-default">
          {title}
        </Text>
        {titleIcon ? (
          <Image
            source={titleIcon}
            contentFit="contain"
            style={{ width: 32, height: 14 }}
          />
        ) : null}
      </View>

      <View className="flex-1 flex-col items-start gap-5 self-stretch">
        <OnboardingSlideSubtitleSection subtitle={subtitle} />
        {image}
        <DetailCard title={detailTitle} items={detailItems} />
      </View>
    </View>
  );
};
