import { useEffect, useState, type ComponentType } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Moon, Smartphone, Sun, type LucideProps } from 'lucide-react-native';
import {
  themedColors,
  useThemedColor,
  useThemePreferenceContext,
  type ThemePreference,
} from '@common';

type ThemeOption = {
  readonly id: ThemePreference;
  readonly Icon: ComponentType<LucideProps>;
  readonly label: string;
};

const OPTIONS: ReadonlyArray<ThemeOption> = [
  { id: 'system', Icon: Smartphone, label: 'System' },
  { id: 'light', Icon: Sun, label: 'Light' },
  { id: 'dark', Icon: Moon, label: 'Dark' },
];

// Outer pill uses `p-1` → 4px of inset on each side. The animated
// slider sits inside the inner row, so the available width that the
// three options share is `containerWidth − 8`.
const HORIZONTAL_PADDING_PX = 8;
const ICON_SIZE = 18;

/**
 * Compact appearance picker for the menu drawer. Single-row pill,
 * three Lucide-icon buttons, with an animated sliding indicator that
 * follows the active preference — mirrors `BuzzConnectionPill` so the
 * motion language stays consistent.
 *
 * Writes through `useThemePreferenceContext`, which persists the
 * choice and applies it to NativeWind on tap.
 */
export const ThemeMenuRow = () => {
  const { preference, setPreference } = useThemePreferenceContext();
  const activeColor = useThemedColor(themedColors.text.primary);
  const inactiveColor = useThemedColor(themedColors.text.tertiary);
  const [containerWidth, setContainerWidth] = useState(0);

  const optionWidth = Math.max(
    (containerWidth - HORIZONTAL_PADDING_PX) / OPTIONS.length,
    0,
  );
  const activeIndex = OPTIONS.findIndex((opt) => opt.id === preference);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (optionWidth <= 0) {
      return;
    }
    translateX.value = withSpring(activeIndex * optionWidth, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, optionWidth, translateX]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="bg-tk-bg-elevated-secondary self-stretch overflow-hidden rounded-round p-1"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <View className="relative flex-row items-center">
        {optionWidth > 0 ? (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: optionWidth,
              },
              sliderStyle,
            ]}
            className="bg-tk-bg-primary border-tk-border-secondary rounded-round border shadow-small"
          />
        ) : null}

        {OPTIONS.map((opt) => {
          const isActive = opt.id === preference;
          const Icon = opt.Icon;
          return (
            <TouchableOpacity
              key={opt.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={opt.label}
              onPress={() => setPreference(opt.id)}
              className="min-h-[36px] flex-1 items-center justify-center"
            >
              <Icon
                size={ICON_SIZE}
                color={isActive ? activeColor : inactiveColor}
                strokeWidth={2}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
