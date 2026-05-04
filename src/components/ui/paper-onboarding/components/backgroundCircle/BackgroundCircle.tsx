import { memo } from 'react';
import { I18nManager } from 'react-native';
import { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { BackgroundCircleProps } from '../../types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BackgroundCircleComponent = ({
  index,
  animatedIndex,
  color,
  extendedSize,
  bottomPosition,
  screenDimensions,
  indicatorSize,
  animatedIndicatorsContainerPosition,
}: BackgroundCircleProps) => {
  const animatedRadius = useDerivedValue(() => {
    const focus = interpolate(
      animatedIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 2],
      Extrapolation.CLAMP,
    );
    return interpolate(focus, [0, 1], [0, extendedSize], Extrapolation.CLAMP);
  });

  const animatedCx = useDerivedValue(() => {
    const baseOffset = I18nManager.isRTL
      ? -((index + 1) * indicatorSize) + screenDimensions.width
      : index * indicatorSize;
    return (
      animatedIndicatorsContainerPosition.value + indicatorSize / 2 + baseOffset
    );
  });

  const animatedProps = useAnimatedProps(() => ({
    r: animatedRadius.value,
    cx: animatedCx.value,
  }));

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      cy={bottomPosition}
      fill={color}
    />
  );
};

const BackgroundCircle = memo(BackgroundCircleComponent);

export default BackgroundCircle;
