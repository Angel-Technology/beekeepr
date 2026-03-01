import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { IconButton } from '@components';
import { colors } from '@common/colors';
import clsx from 'clsx';

type OnboardingPaginationProps = {
  backAccessibilityLabel: string;
  backDisabled?: boolean;
  className?: string;
  itemCount: number;
  nextAccessibilityLabel: string;
  nextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
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
      [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
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
  backAccessibilityLabel,
  backDisabled = false,
  className,
  itemCount,
  nextAccessibilityLabel,
  nextDisabled = false,
  onBack,
  onNext,
  pageWidth,
  x,
}: OnboardingPaginationProps) => {
  return (
    <View
      className={clsx(
        'w-full flex-row items-center justify-between',
        className,
      )}
    >
      <IconButton
        accessibilityLabel={backAccessibilityLabel}
        disabled={backDisabled}
        icon={
          <ArrowLeft
            color={colors.text.secondary}
            size={20}
            strokeWidth={2.25}
          />
        }
        onPress={onBack}
        variant="outline"
      />

      <View className="h-[44px] items-center justify-center py-[10px]">
        <View className="flex-row items-center justify-center gap-sm rounded-full bg-bg-medium px-4 py-sm">
          {Array.from({ length: itemCount }, (_, index) => (
            <Dot
              key={`dot-${index}`}
              index={index}
              x={x}
              pageWidth={pageWidth}
            />
          ))}
        </View>
      </View>

      <IconButton
        accessibilityLabel={nextAccessibilityLabel}
        disabled={nextDisabled}
        icon={
          <ArrowRight
            color={colors.action.neutral.text.onAction}
            size={20}
            strokeWidth={2.25}
          />
        }
        onPress={onNext}
      />
    </View>
  );
};
