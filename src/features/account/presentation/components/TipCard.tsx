import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Lightbulb } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

type TipCardProps = {
  title: string;
  children: ReactNode;
};

export const TipCard = ({ title, children }: TipCardProps) => {
  // Lightbulb glyph is a string-color prop — flip with the theme.
  const iconColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full flex-row items-center gap-4 self-stretch rounded-5 border border-tk-border-secondary px-4 py-2">
      <View className="items-center justify-center rounded-round border-2 border-tk-alerts-success p-3">
        <Lightbulb size={24} color={iconColor} />
      </View>
      <View className="flex-1 gap-0">
        <Text className="font-lexend-semiBold text-footnote leading-[18px] text-tk-text-primary">
          {title}
        </Text>
        <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-tertiary">
          {children}
        </Text>
      </View>
    </View>
  );
};
