import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type InfoSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export const InfoSection = ({
  title,
  description,
  children,
}: InfoSectionProps) => (
  <View className="w-full gap-4 self-stretch">
    {title || description ? (
      <View className="gap-2 px-1">
        {title ? (
          <Text className="font-lexend-regular text-footnote uppercase leading-[18px] text-tk-text-secondary">
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-secondary">
            {description}
          </Text>
        ) : null}
      </View>
    ) : null}
    {children}
  </View>
);
