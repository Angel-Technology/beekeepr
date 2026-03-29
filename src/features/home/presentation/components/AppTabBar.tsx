import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type {
  BottomTabBarButtonProps,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const BASE_TAB_BAR_HEIGHT = 70;
const HORIZONTAL_PADDING = 10;
const TOP_PADDING = 10;
const MIN_BOTTOM_PADDING = 12;
const ACTIVE_PILL_INSET = 4;
const ACTIVE_PILL_RADIUS = 18;
const ACTIVE_PILL_COLOR = '#FFF4BE';
const ACTIVE_PILL_BORDER_COLOR = '#F1D972';
const ACTIVE_TEXT_COLOR = '#000000';
const INACTIVE_TEXT_COLOR = 'rgba(0, 0, 0, 0.45)';
const TAB_ICON_SIZE = 22;
const TAB_ANIMATION_DURATION = 220;

const getTabLabel = (
  options: BottomTabBarProps['descriptors'][string]['options'],
  routeName: string,
) => {
  if (typeof options.tabBarLabel === 'string') {
    return options.tabBarLabel;
  }

  if (typeof options.title === 'string') {
    return options.title;
  }

  return routeName;
};

const getTabTextColor = (isFocused: boolean) => {
  return isFocused ? ACTIVE_TEXT_COLOR : INACTIVE_TEXT_COLOR;
};

type TabButtonProps = {
  isFocused: boolean;
  label: string;
  onPress: BottomTabBarButtonProps['onPress'];
  onLongPress: BottomTabBarButtonProps['onLongPress'];
  accessibilityLabel?: string;
  testID?: string;
  icon?: ReturnType<
    NonNullable<
      BottomTabBarProps['descriptors'][string]['options']['tabBarIcon']
    >
  >;
};

const TabButton = ({
  isFocused,
  label,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
  icon,
}: TabButtonProps) => {
  const color = getTabTextColor(isFocused);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View className="items-center justify-center gap-1">
        {icon}
        <Text className="font-sourceSans-semiBold text-xs" style={{ color }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

export const AppTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const bottomPadding = Math.max(insets.bottom, MIN_BOTTOM_PADDING);
  const containerHeight = BASE_TAB_BAR_HEIGHT + bottomPadding;
  const tabCount = state.routes.length;
  const slotWidth = tabCount > 0 ? tabBarWidth / tabCount : 0;

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      width: Math.max(slotWidth - ACTIVE_PILL_INSET * 2, 0),
      transform: [
        {
          translateX: withTiming(state.index * slotWidth + ACTIVE_PILL_INSET, {
            duration: TAB_ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
    };
  }, [slotWidth, state.index]);

  return (
    <View
      onLayout={(event) => {
        const nextWidth =
          event.nativeEvent.layout.width - HORIZONTAL_PADDING * 2;
        setTabBarWidth(Math.max(nextWidth, 0));
      }}
      style={{
        height: containerHeight,
        paddingTop: TOP_PADDING,
        paddingBottom: bottomPadding,
        paddingHorizontal: HORIZONTAL_PADDING,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: -4 },
        elevation: 10,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
        }}
      />

      <View className="relative flex-1 flex-row">
        <Animated.View
          className="absolute bottom-0 top-0"
          style={[
            {
              left: 0,
              backgroundColor: ACTIVE_PILL_COLOR,
              borderColor: ACTIVE_PILL_BORDER_COLOR,
              borderRadius: ACTIVE_PILL_RADIUS,
            },
            animatedPillStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = getTabLabel(options, route.name);
          const color = getTabTextColor(isFocused);
          const icon = options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color,
                size: TAB_ICON_SIZE,
              })
            : null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              label={label}
              icon={icon}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};
