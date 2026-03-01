import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { OnBoardingDetailCard } from './OnBoardingDetailCard';

type OnboardingSlideCardProps = {
  title: string;
  badge?: string;
  subtitle?: string;
  bullets?: string[];
  image: ReactNode;
  detailTitle: string;
  detailItems: string[];
};

export function OnboardingSlideCard({
  title,
  badge,
  subtitle,
  bullets,
  image,
  detailTitle,
  detailItems,
}: OnboardingSlideCardProps) {
  return (
    <View className="flex flex-col items-center gap-6 self-stretch rounded-5 border border-border-weak p-5">
      <Text className="font-poppins-semiBold text-[25px] leading-[30px] text-text-default">
        {title}
      </Text>
      <View className="flex-row items-center justify-center gap-2">
        {badge ? (
          <View className="rounded-full bg-bg-primary px-2 py-1">
            <Text className="font-sourceSans-semiBold text-[10px] leading-[10px] text-text-default">
              {badge}
            </Text>
          </View>
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

      <OnBoardingDetailCard title={detailTitle} items={detailItems} />
    </View>
  );
}
