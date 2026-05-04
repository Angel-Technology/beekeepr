import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { VerificationStatusPill } from '@components';

type WhatWeDoSlideProps = {
  illustration: ReactNode;
  title: string;
  body: ReactNode;
  pillLabel?: string;
  pillIcon?: ReactNode;
  cta?: ReactNode;
};

export const WhatWeDoSlide = ({
  illustration,
  title,
  body,
  pillLabel,
  pillIcon,
  cta,
}: WhatWeDoSlideProps) => {
  return (
    <View className="w-full max-w-[345px] items-center gap-6 self-center py-4">
      <View className="w-full items-center gap-4">
        {pillLabel ? (
          <VerificationStatusPill
            label={pillLabel}
            size="sm"
            className="bg-bg-default px-3.5"
            icon={pillIcon}
          />
        ) : null}
        {illustration}
      </View>

      <View className="w-full items-center gap-4">
        <Text className="w-full text-center font-poppins-semiBold text-2xl leading-tight text-text-default">
          {title}
        </Text>
        <View className="w-full items-center">{body}</View>
      </View>

      {cta ? <View className="w-full items-center pt-2">{cta}</View> : null}
    </View>
  );
};
