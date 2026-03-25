import { Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TAB_BAR_HEIGHT = 84;
const TAB_BAR_PADDING = 10;
const ACTIVE_PILL_INSET = 4;
const ACTIVE_PILL_RADIUS = 18;
const ACTIVE_PILL_COLOR = '#FFF4BE';
const ACTIVE_TEXT_COLOR = '#000000';
const INACTIVE_TEXT_COLOR = 'rgba(0, 0, 0, 0.45)';

export const AppTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const translateX = useSharedValue(0);
  const tabBarWidth = useSharedValue(0);

  const tabCount = state.routes.length;
  const slotWidth =
    tabCount > 0 ? Math.max(tabBarWidth.value / tabCount, 0) : 0;

  translateX.value = withTiming(state.index * slotWidth + ACTIVE_PILL_INSET, {
    duration: 220,
    easing: Easing.out(Easing.cubic),
  });

  const animatedPillStyle = useAnimatedStyle(() => {
    const currentSlotWidth =
      state.routes.length > 0 ? tabBarWidth.value / state.routes.length : 0;

    return {
      width: Math.max(currentSlotWidth - ACTIVE_PILL_INSET * 2, 0),
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [state.routes.length]);

  return (
    <View
      className="border-t border-border-subtle bg-white"
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width - TAB_BAR_PADDING * 2;
        tabBarWidth.value = Math.max(nextWidth, 0);
      }}
      style={{
        height: TAB_BAR_HEIGHT,
        paddingTop: TAB_BAR_PADDING,
        paddingBottom: 14,
        paddingHorizontal: TAB_BAR_PADDING,
      }}
    >
      <View className="relative flex-1 flex-row">
        <Animated.View
          className="absolute bottom-0 top-0"
          style={[
            {
              left: 0,
              backgroundColor: ACTIVE_PILL_COLOR,
              borderRadius: ACTIVE_PILL_RADIUS,
            },
            animatedPillStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;
          const color = isFocused ? ACTIVE_TEXT_COLOR : INACTIVE_TEXT_COLOR;
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
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View className="items-center justify-center gap-1">
                {options.tabBarIcon
                  ? options.tabBarIcon({
                      focused: isFocused,
                      color,
                      size: 22,
                    })
                  : null}
                <Text
                  className="font-sourceSans-semiBold text-xs"
                  style={{ color }}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
