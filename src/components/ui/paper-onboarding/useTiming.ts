import type { SharedValue } from 'react-native-reanimated';
import {
  useDerivedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { I18nManager } from 'react-native';

interface UseTimingProps {
  translationValue: SharedValue<number>;
  velocityValue: SharedValue<number>;
  gestureActive: SharedValue<boolean>;
  size: number;
  screenWidth: number;
  currentIndex: SharedValue<number>;
  onSnap?: (index: number) => void;
}

const TIMING_CONFIG = {
  duration: 500,
  easing: Easing.out(Easing.exp),
};

export const useTiming = ({
  translationValue,
  velocityValue,
  gestureActive,
  size,
  screenWidth,
  currentIndex,
  onSnap,
}: UseTimingProps): SharedValue<number> => {
  const animatedIndex = useDerivedValue(() => {
    if (gestureActive.value) {
      const rawTranslation = translationValue.value;
      const clampedTranslation = Math.max(
        -screenWidth,
        Math.min(screenWidth, rawTranslation),
      );
      const normalizedDrag = I18nManager.isRTL
        ? clampedTranslation / screenWidth
        : -clampedTranslation / screenWidth;

      const idx = currentIndex.value;
      // Clamp so we can't drag past first/last page
      if (idx === 0 && normalizedDrag < 0) {
        return idx;
      }
      if (idx === size - 1 && normalizedDrag > 0) {
        return idx;
      }
      return idx + normalizedDrag;
    }

    // Gesture ended — determine target
    const rawTranslation = translationValue.value;
    const rawVelocity = velocityValue.value;
    const normalizedDrag = I18nManager.isRTL
      ? rawTranslation / screenWidth
      : -rawTranslation / screenWidth;
    const normalizedVelocity = I18nManager.isRTL
      ? rawVelocity / (screenWidth * 2)
      : -rawVelocity / (screenWidth * 2);

    const idx = currentIndex.value;
    const combined = Math.abs(normalizedDrag) + Math.abs(normalizedVelocity);

    let targetIndex = idx;
    if (combined > 0.5) {
      const direction = normalizedDrag + normalizedVelocity;
      if (direction > 0 && idx < size - 1) {
        targetIndex = idx + 1;
      } else if (direction < 0 && idx > 0) {
        targetIndex = idx - 1;
      }
    }

    if (targetIndex !== idx && onSnap) {
      runOnJS(onSnap)(targetIndex);
    }

    return withTiming(targetIndex, TIMING_CONFIG, (finished) => {
      'worklet';
      if (finished) {
        currentIndex.value = targetIndex;
        translationValue.value = 0;
        velocityValue.value = 0;
      }
    });
  }, [translationValue, velocityValue, gestureActive]);

  return animatedIndex;
};
