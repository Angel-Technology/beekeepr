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
  pageWidth: number;
  x: SharedValue<number>;
};

type DotProps = {
  index: number;
  x: SharedValue<number>;
  pageWidth: number;
};

const Dot = ({ index, x, pageWidth }: DotProps) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      x.value,
      [
        (index - 1) * pageWidth,
        index * pageWidth,
        (index + 1) * pageWidth,
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
};

export const OnboardingPagination = ({
  itemCount,
  pageWidth,
  x,
}: OnboardingPaginationProps) => {
  return (
    <View className="h-[44px] items-center justify-center py-[10px]">
      <View className="flex-row items-center justify-center gap-sm rounded-full bg-bg-medium px-4 py-sm">
        {Array.from({ length: itemCount }, (_, index) => (
          <Dot key={`dot-${index}`} index={index} x={x} pageWidth={pageWidth} />
        ))}
      </View>
    </View>
  );
};
