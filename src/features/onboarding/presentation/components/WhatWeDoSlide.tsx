import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { VerificationStatusPill } from '@components';

type WhatWeDoSlideProps = {
  illustration: ReactNode;
  badgeLabel: string;
  title: string;
};

export const WhatWeDoSlide = ({
  illustration,
  badgeLabel,
  title,
}: WhatWeDoSlideProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-6 self-stretch">
      <View className="items-center justify-center self-stretch">
        {illustration}
      </View>

      <VerificationStatusPill
        label={badgeLabel}
        size="sm"
        className="bg-text-default"
        textClassName="text-text-inverse"
        iconColor="#FFFFFF"
      />

      <Text className="text-center font-poppins-semiBold text-700 text-text-default">
        {title}
      </Text>
    </View>
  );
};
