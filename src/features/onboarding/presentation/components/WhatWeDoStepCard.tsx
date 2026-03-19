import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import type { AppImageSource } from '@assets/images';
import { VerificationStatusPill } from './VerificationStatusPill';

type WhatWeDoStepCardProps = {
  image: AppImageSource;
  imageWidth: number;
  imageHeight: number;
  badgeLabel: string;
  title: string;
};

export const WhatWeDoStepCard = ({
  image,
  imageWidth,
  imageHeight,
  badgeLabel,
  title,
}: WhatWeDoStepCardProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-6 self-stretch p-5">
      <View className="flex h-[354px] flex-col items-center justify-end self-stretch">
        <Image
          source={image}
          contentFit="contain"
          style={{ width: imageWidth, height: imageHeight }}
        />
      </View>

      <View className="items-center gap-6 self-stretch">
        <VerificationStatusPill label={badgeLabel} />
        <Text className="text-center font-poppins-semiBold text-700 text-text-default">
          {title}
        </Text>
      </View>
    </View>
  );
};
