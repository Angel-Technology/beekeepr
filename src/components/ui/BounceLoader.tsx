import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import clsx from 'clsx';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@src/common/colors';

type BounceLoaderProps = {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

const DURATION = 300;
const BOUNCE_HEIGHT = -8;
const DELAY_GAP = 120;

export function BounceLoader({
  color = colors.bg.disabled,
  size = 8,
  style,
  className,
}: BounceLoaderProps) {
  const dotOne = useSharedValue(0);
  const dotTwo = useSharedValue(0);
  const dotThree = useSharedValue(0);

  useEffect(() => {
    const createAnimation = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(BOUNCE_HEIGHT, {
              duration: DURATION,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0, {
              duration: DURATION,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          -1,
          false,
        ),
      );

    dotOne.value = createAnimation(0);
    dotTwo.value = createAnimation(DELAY_GAP);
    dotThree.value = createAnimation(DELAY_GAP * 2);
  }, [dotOne, dotTwo, dotThree]);

  const dotOneStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dotOne.value }],
  }));

  const dotTwoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dotTwo.value }],
  }));

  const dotThreeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dotThree.value }],
  }));

  const dotStyle = {
    backgroundColor: color,
    width: size,
    height: size,
  };

  return (
    <View
      className={clsx(
        'h-6 flex-row items-center justify-center gap-2',
        className,
      )}
      style={style}
    >
      <Animated.View className="rounded-full" style={[dotStyle, dotOneStyle]} />
      <Animated.View className="rounded-full" style={[dotStyle, dotTwoStyle]} />
      <Animated.View
        className="rounded-full"
        style={[dotStyle, dotThreeStyle]}
      />
    </View>
  );
}
