import { useEffect } from 'react';
import clsx from 'clsx';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export interface BounceLoaderProps {
  colorClassName?: string;
  className?: string;
  testID?: string;
}

const BOUNCE_HEIGHT = -4;
const DURATION = 800;
const STAGGER_DELAY = 150;

export const BounceLoader = ({
  colorClassName = 'bg-text-inverse',
  className,
  testID,
}: BounceLoaderProps) => {
  const bounce1 = useSharedValue(0);
  const bounce2 = useSharedValue(0);
  const bounce3 = useSharedValue(0);

  useEffect(() => {
    const createBounceAnimation = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        ),
      );

    bounce1.value = createBounceAnimation(0);
    bounce2.value = createBounceAnimation(STAGGER_DELAY);
    bounce3.value = createBounceAnimation(STAGGER_DELAY * 2);
  }, [bounce1, bounce2, bounce3]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce1.value * BOUNCE_HEIGHT }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce2.value * BOUNCE_HEIGHT }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce3.value * BOUNCE_HEIGHT }],
  }));

  return (
    <View
      testID={testID}
      className={clsx('flex-row items-center justify-center gap-sm', className)}
    >
      <Animated.View
        className={clsx('size-2 rounded-full', colorClassName)}
        style={animatedStyle1}
      />
      <Animated.View
        className={clsx('size-2 rounded-full', colorClassName)}
        style={animatedStyle2}
      />
      <Animated.View
        className={clsx('size-2 rounded-full', colorClassName)}
        style={animatedStyle3}
      />
    </View>
  );
};
