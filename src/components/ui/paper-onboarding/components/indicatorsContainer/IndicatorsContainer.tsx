import { useMemo, useCallback, memo } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Indicator from '../indicator';
import { styles } from './styles';
import type { IndicatorsContainerProps } from '../../types';

const IndicatorsContainerComponent = ({
  data,
  animatedIndex,
  animatedIndicatorsContainerPosition,
  indicatorSize,
  indicatorBackgroundColor,
  indicatorBorderColor,
  safeInsets,
}: IndicatorsContainerProps) => {
  const containerWidth = useMemo(
    () => data.length * indicatorSize,
    [data, indicatorSize],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedIndicatorsContainerPosition.value }],
  }));

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width: containerWidth,
        height: indicatorSize,
        bottom: safeInsets.bottom,
      },
      containerAnimatedStyle,
    ],
    [containerWidth, indicatorSize, containerAnimatedStyle, safeInsets],
  );

  const renderIndicators = useCallback(
    () =>
      data.map((item, index) => (
        <Indicator
          key={`item-${index}`}
          indicatorSize={indicatorSize}
          indicatorBackgroundColor={indicatorBackgroundColor}
          indicatorBorderColor={indicatorBorderColor}
          index={index}
          item={item}
          animatedIndex={animatedIndex}
        />
      )),
    [
      data,
      indicatorSize,
      indicatorBackgroundColor,
      indicatorBorderColor,
      animatedIndex,
    ],
  );

  return (
    <Animated.View style={containerStyle}>{renderIndicators()}</Animated.View>
  );
};

const IndicatorsContainer = memo(IndicatorsContainerComponent);

export default IndicatorsContainer;
