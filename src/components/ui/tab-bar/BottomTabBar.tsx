import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import clsx from 'clsx';

import { themedColors, useThemedColor } from '@common';

export const BOTTOM_TAB_BAR_HEIGHT = 60;

const ICON_SIZE = 24;

/**
 * Custom bottom tab bar wired into Expo Router's `<Tabs tabBar={...}>` slot.
 * Renders a translucent blurred bar with a pill-shaped active indicator,
 * matching the B2B Figma nav (Buzz Badge / Criminal Search / Explore).
 *
 * The bar is absolutely positioned so screen content scrolls underneath the
 * blur. Screens themselves are responsible for padding their content past
 * `BOTTOM_TAB_BAR_HEIGHT + insets.bottom`.
 *
 */
export const BottomTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) => {
  const isDark = useColorScheme() === 'dark';
  const barBg = useThemedColor(themedColors.bg.primary);
  const activeIconColor = useThemedColor(themedColors.text.primary);
  const inactiveIconColor = useThemedColor(themedColors.text.tertiary);

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0"
      style={{ paddingBottom: insets.bottom }}
    >
      {/*
       * iOS: real blur behind the tab bar.
       * Android: expo-blur can't reach the underlying view without a
       * `blurTarget` ref, so we bump the solid fill's opacity to 1 and
       * skip the blur layer entirely. Reads as a plain opaque bar
       * (consistent with system Android tab bars).
       */}
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: barBg,
            opacity: Platform.OS === 'ios' ? 0.85 : 1,
          },
        ]}
      />
      <View
        className="w-full flex-row items-stretch"
        style={{ height: BOTTOM_TAB_BAR_HEIGHT }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);
          const iconColor = isFocused ? activeIconColor : inactiveIconColor;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const handleLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? `${label} tab`
              }
              testID={options.tabBarButtonTestID}
              onPress={handlePress}
              onLongPress={handleLongPress}
              className="relative flex-1 items-center justify-end gap-1 px-1.5 py-2"
            >
              <View className="h-6 w-6 items-center justify-center">
                {options.tabBarIcon
                  ? options.tabBarIcon({
                      color: iconColor,
                      focused: isFocused,
                      size: ICON_SIZE,
                    })
                  : null}
              </View>

              <Text
                className={clsx(
                  'font-lexend-semiBold text-xs leading-none',
                  isFocused ? 'text-tk-text-primary' : 'text-tk-text-tertiary',
                )}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
