import { useMemo, useCallback, memo } from 'react';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import { styles } from './styles';
import type { IndicatorProps } from '../../types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BORDER_WIDTH = 4;

const IndicatorComponent = ({
  index,
  indicatorSize,
  indicatorBackgroundColor,
  indicatorBorderColor,
  animatedIndex,
  item,
}: IndicatorProps) => {
  const radius = useMemo(
    () => (indicatorSize - BORDER_WIDTH) / 2,
    [indicatorSize],
  );
  const inactiveRatio = 0.55;

  const circleAnimatedProps = useAnimatedProps(() => ({
    r: interpolate(
      animatedIndex.value,
      [index - 1, index, index + 1],
      [radius * inactiveRatio, radius, radius * inactiveRatio],
      Extrapolation.CLAMP,
    ),
    fillOpacity: interpolate(
      animatedIndex.value,
      [index - 1, index],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [index - 0.25, index, index + 0.25],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          animatedIndex.value,
          [index - 1, index, index + 1],
          [inactiveRatio, 1, inactiveRatio],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      width: indicatorSize,
      height: indicatorSize,
    }),
    [indicatorSize],
  );

  const iconStyle = useMemo(
    () => [
      styles.iconContainer,
      {
        left: BORDER_WIDTH * 2,
        right: BORDER_WIDTH * 2,
        top: BORDER_WIDTH * 2,
        bottom: BORDER_WIDTH * 2,
        borderRadius: indicatorSize,
      },
      iconAnimatedStyle,
    ],
    [indicatorSize, iconAnimatedStyle],
  );

  const renderIcon = useCallback(() => {
    if (item.icon) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const IconComponent: any = item.icon;
      return (
        <Animated.View style={iconStyle}>
          {typeof IconComponent === 'function' ? (
            IconComponent({ size: indicatorSize / 2 })
          ) : (
            <IconComponent size={indicatorSize / 2} />
          )}
        </Animated.View>
      );
    }
    return null;
  }, [item, indicatorSize, iconStyle]);

  return (
    <Animated.View style={containerStyle}>
      <Svg
        width={indicatorSize}
        height={indicatorSize}
        viewBox={`0 0 ${indicatorSize} ${indicatorSize}`}
      >
        <AnimatedCircle
          animatedProps={circleAnimatedProps}
          cx={indicatorSize / 2}
          cy={indicatorSize / 2}
          fill={indicatorBackgroundColor}
          stroke={indicatorBorderColor}
          strokeWidth={BORDER_WIDTH}
        />
      </Svg>
      {renderIcon()}
    </Animated.View>
  );
};

const Indicator = memo(IndicatorComponent);

export default Indicator;
