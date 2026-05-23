import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BounceLoader } from '@components';
import { useGlobalLoader } from './GlobalLoaderProvider';

const FADE_DURATION = 180;

type GlobalLoaderOverlayProps = {
  /**
   * Force the loader visible regardless of provider state. Intended for
   * quick visual testing only — flip this on in `app/_layout.tsx` to see
   * the overlay without firing a real mutation, then flip it back off.
   */
  forceVisible?: boolean;
};

/**
 * Full-screen overlay that dims the app and centres a bounce loader pill
 * whenever any feature hook has work tracked by `useGlobalLoader`. While
 * visible, it blocks touches on whatever sits behind it.
 */
export const GlobalLoaderOverlay = ({
  forceVisible = false,
}: GlobalLoaderOverlayProps = {}) => {
  const { isActive } = useGlobalLoader();
  const visible = isActive || forceVisible;

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: FADE_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, opacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, backdropStyle]}
      className="items-center justify-center bg-black/40"
    >
      <Animated.View
        style={backdropStyle}
        className="rounded-round bg-bg-strong px-5 py-4 shadow-md"
      >
        <BounceLoader colorClassName="bg-text-inverse" />
      </Animated.View>
    </Animated.View>
  );
};
