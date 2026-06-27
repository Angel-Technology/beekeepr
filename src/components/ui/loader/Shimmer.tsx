import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import clsx from 'clsx';

import { themedColors, useThemedColor } from '@common';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SHIMMER_DURATION = 1500;

const styles = StyleSheet.create({
  gradient: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

export type ShimmerProps = {
  className?: string;
  testID?: string;
};

/**
 * Skeleton-loading placeholder with an animated shimmer sweep.
 *
 * Dimensions must come from the caller via `className` (`h-4 w-20
 * rounded-1`, etc.) — the component is intentionally size-agnostic so
 * it can stand in for any text/avatar/card block.
 *
 * Theming: the resting fill uses `bg.elevatedSecondary` (mid-tone
 * surface) and the gradient sweep peaks at `bg.elevatedTertiary`. Both
 * are runtime-themed via `useThemedColor`, so the same component reads
 * cleanly in light and dark mode without a re-render.
 *
 * Accessibility:
 * - Respects "Reduce Motion" — if the OS flag is set we skip the
 *   gradient and the component renders as a static muted block.
 * - Announces as "Loading" for screen readers.
 */
export const Shimmer = memo(({ className, testID }: ShimmerProps) => {
  const reduceMotion = useReducedMotion();
  const baseColor = useThemedColor(themedColors.bg.elevatedSecondary);
  const peakColor = useThemedColor(themedColors.bg.elevatedTertiary);
  const translateX = useSharedValue(-1);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    translateX.value = withRepeat(
      withTiming(1, {
        duration: SHIMMER_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, [translateX, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: `${translateX.value * 100}%`,
  }));

  return (
    <View
      testID={testID}
      className={clsx('overflow-hidden', className)}
      style={{ backgroundColor: baseColor }}
      accessibilityRole="none"
      accessibilityLabel="Loading"
    >
      {reduceMotion ? null : (
        <AnimatedLinearGradient
          colors={[baseColor, peakColor, baseColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradient, animatedStyle]}
        />
      )}
    </View>
  );
});

Shimmer.displayName = 'Shimmer';
