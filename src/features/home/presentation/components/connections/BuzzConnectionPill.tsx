import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import clsx from 'clsx';

export type ConnectionTab = 'connections' | 'invites';

const TABS = [
  { id: 'connections' as const, label: 'My connections' },
  { id: 'invites' as const, label: 'Invites' },
];

type BuzzConnectionPillProps = {
  active: ConnectionTab;
  onChange: (next: ConnectionTab) => void;
};

const HORIZONTAL_PADDING_PX = 8;

export const BuzzConnectionPill = ({
  active,
  onChange,
}: BuzzConnectionPillProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const tabWidth = Math.max((containerWidth - HORIZONTAL_PADDING_PX) / 2, 0);
  const activeIndex = TABS.findIndex((tab) => tab.id === active);

  const translateX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth <= 0) {
      return;
    }
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, tabWidth, translateX]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="bg-tk-bg-elevated-secondary self-stretch overflow-hidden rounded-round p-1"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <View className="relative flex-row items-center">
        {tabWidth > 0 ? (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: tabWidth,
              },
              animatedPillStyle,
            ]}
            className="bg-tk-bg-primary border-tk-border-secondary rounded-round border shadow-small"
          />
        ) : null}

        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <TouchableOpacity
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChange(tab.id)}
              className="min-h-[44px] flex-1 items-center justify-center px-4"
            >
              <Text
                className={clsx(
                  'font-lexend-semiBold text-sm',
                  isActive ? 'text-tk-text-primary' : 'text-tk-text-secondary',
                )}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
