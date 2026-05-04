import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import { BounceLoader } from '../loader/BounceLoader';

type TabButtonItem = {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode | null;
  children?: ReactNode;
  childrenTextStyle?: TextStyle;
};

type TabButtonProps = {
  tabs: TabButtonItem[];
  style?: ViewStyle;
  childrenStyle?: ViewStyle;
};

export const TabButton = ({ tabs, style, childrenStyle }: TabButtonProps) => {
  return (
    <View
      className="mx-auto w-full rounded-5 border border-secondary bg-bg-default"
      style={style}
    >
      {tabs.map((tab, index) => {
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;
        const isDisabled = Boolean(tab.disabled || tab.loading);
        const rightIconToShow =
          tab.rightIcon === undefined ? (
            <ChevronRight color="#000000" size={20} />
          ) : (
            tab.rightIcon
          );

        return (
          <Pressable
            key={`${tab.text}-${index}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: tab.loading }}
            disabled={isDisabled}
            onPress={tab.onPress}
            className={clsx(
              'w-full flex-row items-center justify-between self-stretch bg-bg-default px-5 py-4',
              isFirst && 'rounded-t-5',
              isLast && 'rounded-b-5',
              !isLast && 'border-b border-border-secondary',
              isDisabled && 'opacity-50',
            )}
          >
            {tab.loading ? (
              <View className="w-full items-center justify-center">
                <View className="h-6 w-6 items-center justify-center">
                  <BounceLoader colorClassName="bg-text-default" />
                </View>
              </View>
            ) : (
              <>
                <View className="flex-1 flex-row items-center gap-2.5">
                  {tab.leftIcon ? (
                    <View className="h-6 w-6 items-center justify-center">
                      {tab.leftIcon}
                    </View>
                  ) : null}
                  <Text className="flex-1 font-sourceSans-semiBold text-base leading-[20.8px] text-text-default">
                    {tab.text}
                  </Text>
                </View>

                <View
                  className="flex-row items-center justify-center gap-1"
                  style={childrenStyle}
                >
                  {typeof tab.children === 'string' ? (
                    <Text
                      className="font-sourceSans-regular text-base text-text-weak"
                      style={tab.childrenTextStyle}
                    >
                      {tab.children}
                    </Text>
                  ) : (
                    tab.children
                  )}
                  {rightIconToShow !== null ? (
                    <View className="h-6 w-6 items-center justify-center">
                      {rightIconToShow}
                    </View>
                  ) : null}
                </View>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
