import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { AppImageSource } from '@assets/images';
import { DetailCard } from '@components';

type OnboardingSlideCardProps = {
  title: string;
  titleIcon?: AppImageSource;
  subtitle?: string;
  bullets?: string[];
  image: ReactNode;
  detailTitle: string;
  detailItems: string[];
};

export function OnboardingSlideCard({
  title,
  titleIcon,
  subtitle,
  bullets,
  image,
  detailTitle,
  detailItems,
}: OnboardingSlideCardProps) {
  return (
    <View className="flex flex-col items-center gap-6 self-stretch rounded-5 border border-border-weak p-5">
      <View className="flex-row  justify-center gap-2 self-stretch">
        <Text className="font-poppins-semiBold text-[25px] leading-[30px] text-text-default">
          {title}
        </Text>
        {titleIcon ? (
          <Image
            source={titleIcon}
            contentFit="contain"
            style={{ width: 33, height: 15 }}
          />
        ) : null}
      </View>

      {subtitle ? (
        <View className="mt-4">
          <Text className="font-sourceSans-semiBold text-[15px] leading-[19px] text-text-default">
            {subtitle}
          </Text>
          {bullets ? (
            <View className="mt-2 gap-1">
              {bullets.map((bullet) => (
                <View key={bullet} className="flex-row gap-2">
                  <Text className="font-sourceSans-regular text-[14px] leading-[18px] text-text-secondary">
                    •
                  </Text>
                  <Text className="flex-1 font-sourceSans-regular text-[14px] leading-[18px] text-text-secondary">
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {image}

      <DetailCard title={detailTitle} items={detailItems} />
    </View>
  );
}
