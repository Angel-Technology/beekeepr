import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react-native';
import type { TextStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { themedColors, useThemedColor } from '@common';

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

export const MenuSection = ({ items }: MenuSectionProps) => {
  const chevronColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="border-tk-border-secondary w-full self-stretch overflow-hidden rounded-lg border">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            onPress={item.onPress}
            className="w-full self-stretch px-6"
          >
            <View
              className={clsx(
                'w-full flex-row items-center gap-4 py-4',
                !isLast && 'border-tk-border-secondary border-b',
              )}
            >
              <Text
                className="text-tk-text-primary flex-1 font-lexend-regular text-base leading-6"
                style={[{ letterSpacing: -0.3 }, item.labelStyle]}
              >
                {item.label}
              </Text>
              <View className="h-6 w-6 items-center justify-center">
                {item.icon ?? (
                  <ChevronRight size={MENU_ICON_SIZE} color={chevronColor} />
                )}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
