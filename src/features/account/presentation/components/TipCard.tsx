import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Lightbulb } from 'lucide-react-native';

type TipCardProps = {
  title: string;
  children: ReactNode;
};

export const TipCard = ({ title, children }: TipCardProps) => (
  <View className="w-full flex-row items-center gap-4 self-stretch rounded-5 border border-border-weak px-4 py-2">
    <View className="items-center  justify-center rounded-round border-2 border-border-success p-3">
      <Lightbulb size={24} color="#000000" />
    </View>
    <View className="flex-1 gap-0">
      <Text className="font-lexend-semiBold text-footnote leading-[18px] text-text-default">
        {title}
      </Text>
      <Text className="font-lexend-regular text-footnote leading-[18px] text-text-tertiary">
        {children}
      </Text>
    </View>
  </View>
);
