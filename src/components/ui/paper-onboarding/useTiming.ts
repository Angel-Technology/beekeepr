import type { SharedValue } from 'react-native-reanimated';
import { useDerivedValue, withTiming, Easing } from 'react-native-reanimated';
import { I18nManager } from 'react-native';

interface UseTimingProps {
  translationValue: SharedValue<number>;
  gestureActive: SharedValue<boolean>;
  size: number;
  screenWidth: number;
  currentIndex: SharedValue<number>;
}

const TIMING_CONFIG = {
  duration: 500,
  easing: Easing.out(Easing.exp),
};

export const useTiming = ({
  translationValue,
  gestureActive,
  size,
  screenWidth,
  currentIndex,
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
      if (idx === 0 && normalizedDrag < 0) {
        return idx;
      }
      if (idx === size - 1 && normalizedDrag > 0) {
        return idx;
      }
      return idx + normalizedDrag;
    }

    return withTiming(currentIndex.value, TIMING_CONFIG);
  });

  return animatedIndex;
};
