import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { colors } from '@common/colors';

type OnboardingPaginationProps = {
  itemCount: number;
  x: SharedValue<number>;
};

type DotProps = {
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
};

function Dot({ index, x, screenWidth }: DotProps) {
  const animatedDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      x.value,
      [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      backgroundColor: colors.text.default,
    };
  });

  return (
    <Animated.View
      className="h-sm w-sm rounded-full"
      style={animatedDotStyle}
    />
  );
}

export function OnboardingPagination({
  itemCount,
  x,
}: OnboardingPaginationProps) {
  const { width: deviceWidth } = useWindowDimensions();
  const screenWidth = Math.min(deviceWidth, 500);

  return (
    <View className="h-[44px]  flex-1 items-center justify-center py-[10px]">
      <View className="flex flex-row items-center justify-center  gap-sm rounded-full bg-bg-medium px-4 py-sm">
        {Array.from({ length: itemCount }, (_, index) => (
          <Dot
            key={`dot-${index}`}
            index={index}
            x={x}
            screenWidth={screenWidth}
          />
        ))}
      </View>
    </View>
  );
}
