import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react-native';
import type { TextStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

const MENU_ICON_SIZE = 20;

export type MenuItem = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
};

type MenuSectionProps = {
  items: readonly MenuItem[];
};

const DEFAULT_ICON = <ChevronRight size={MENU_ICON_SIZE} color="#000000" />;

export const MenuSection = ({ items }: MenuSectionProps) => (
  <View className="w-full overflow-hidden rounded-5 border border-secondary bg-bg-default">
    {items.map((item, index) => {
      const isLast = index === items.length - 1;

      return (
        <Pressable
          key={item.label}
          accessibilityRole="button"
          accessibilityLabel={item.accessibilityLabel ?? item.label}
          onPress={item.onPress}
          className={clsx(
            'w-full flex-row items-center bg-bg-default py-4 pl-6 pr-4',
            !isLast && 'border-b border-secondary',
          )}
        >
          <Text
            className="flex-1 font-lexend-regular text-base leading-6 text-text-default"
            style={[{ letterSpacing: -0.3 }, item.labelStyle]}
          >
            {item.label}
          </Text>
          <View className="h-6 w-6 items-center justify-center">
            {item.icon ?? DEFAULT_ICON}
          </View>
        </Pressable>
      );
    })}
  </View>
);
