import {
  useMemo,
  useCallback,
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Dimensions,
  Insets,
  LayoutChangeEvent,
  I18nManager,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import Background from './components/background';
import Page from './components/page';
import IndicatorsContainer from './components/indicatorsContainer';
import CloseButton from './components/closeButton';
import { useTiming } from './useTiming';
import {
  DEFAULT_SAFE_INSET,
  DEFAULT_DIRECTION,
  DEFAULT_INDICATOR_SIZE,
  DEFAULT_INDICATOR_BORDER_COLOR,
  DEFAULT_INDICATOR_BACKGROUND_COLOR,
  DEFAULT_CLOSE_BUTTON_TEXT,
  DEFAULT_CLOSE_BUTTON_CALLBACK,
} from './constants';
import { styles } from './styles';
import type {
  PaperOnboardingProps,
  PaperOnboardingMethods,
  PaperOnboardingScreenDimensions,
} from './types';

type PaperOnboarding = PaperOnboardingMethods;

const PaperOnboardingComponent = forwardRef<
  PaperOnboarding,
  PaperOnboardingProps
>(
  (
    {
      data,
      safeInsets: _safeInsets,
      direction = DEFAULT_DIRECTION,
      indicatorSize = DEFAULT_INDICATOR_SIZE,
      indicatorBackgroundColor = DEFAULT_INDICATOR_BACKGROUND_COLOR,
      indicatorBorderColor = DEFAULT_INDICATOR_BORDER_COLOR,
      titleStyle,
      descriptionStyle,
      closeButton,
      closeButtonTextStyle,
      closeButtonText = DEFAULT_CLOSE_BUTTON_TEXT,
      onCloseButtonPress = DEFAULT_CLOSE_BUTTON_CALLBACK,
      onIndexChange,
    },
    ref
  ) => {
    const [dimensions, setDimensions] =
      useState<PaperOnboardingScreenDimensions>({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      });

    const safeInsets = useMemo<Required<Insets>>(() => {
      return {
        top: _safeInsets?.top ?? DEFAULT_SAFE_INSET,
        bottom: _safeInsets?.bottom ?? DEFAULT_SAFE_INSET,
        left: _safeInsets?.left ?? DEFAULT_SAFE_INSET,
        right: _safeInsets?.right ?? DEFAULT_SAFE_INSET,
      };
    }, [_safeInsets]);

    const indicatorsContainerLeftPadding = useMemo(() => {
      const containerLeftPadding = dimensions.width / 2 - indicatorSize / 2;
      return I18nManager.isRTL
        ? -containerLeftPadding + indicatorSize * (data.length - 1)
        : containerLeftPadding;
    }, [dimensions.width, indicatorSize, data.length]);

    // Gesture shared values
    const translationValue = useSharedValue(0);
    const velocityValue = useSharedValue(0);
    const gestureActive = useSharedValue(false);
    const currentIndex = useSharedValue(0);

    const animatedIndex = useTiming({
      translationValue,
      velocityValue,
      gestureActive,
      size: data.length,
      screenWidth: dimensions.width,
      currentIndex,
      onSnap: onIndexChange,
    });

    const animatedIndicatorsContainerPosition = useDerivedValue(() => {
      const inputRange = data.map((_, index) => index);
      const outputRange = data.map((_, index) => index * indicatorSize * -1);
      return (
        interpolate(
          animatedIndex.value,
          inputRange,
          I18nManager.isRTL ? [...outputRange].reverse() : outputRange,
          Extrapolation.CLAMP
        ) + indicatorsContainerLeftPadding
      );
    });

    // Gesture
    const panGesture = Gesture.Pan()
      .onStart(() => {
        'worklet';
        gestureActive.value = true;
      })
      .onUpdate(event => {
        'worklet';
        translationValue.value =
          direction === 'horizontal' ? event.translationX : event.translationY;
        velocityValue.value =
          direction === 'horizontal' ? event.velocityX : event.velocityY;
      })
      .onEnd(() => {
        'worklet';
        gestureActive.value = false;
      })
      .onFinalize(() => {
        'worklet';
        gestureActive.value = false;
      });

    // Public methods
    const handleNavigateToNextPage = useCallback(() => {
      const idx = currentIndex.value;
      if (idx >= data.length - 1) return;
      const target = idx + 1;
      currentIndex.value = target;
      translationValue.value = 0;
      velocityValue.value = 0;
      gestureActive.value = false;
    }, [
      data.length,
      currentIndex,
      translationValue,
      velocityValue,
      gestureActive,
    ]);

    const handleNavigateToPreviousPage = useCallback(() => {
      const idx = currentIndex.value;
      if (idx <= 0) return;
      const target = idx - 1;
      currentIndex.value = target;
      translationValue.value = 0;
      velocityValue.value = 0;
      gestureActive.value = false;
    }, [currentIndex, translationValue, velocityValue, gestureActive]);

    useImperativeHandle(
      ref,
      () => ({
        next: handleNavigateToNextPage,
        previous: handleNavigateToPreviousPage,
      }),
      [handleNavigateToNextPage, handleNavigateToPreviousPage]
    );

    // Index change callback
    useAnimatedReaction(
      () => Math.round(animatedIndex.value),
      (roundedIndex, previousRoundedIndex) => {
        if (
          previousRoundedIndex !== null &&
          roundedIndex !== previousRoundedIndex &&
          onIndexChange
        ) {
          runOnJS(onIndexChange)(roundedIndex);
        }
      }
    );

    const handleOnLayout = useCallback(
      ({
        nativeEvent: {
          layout: { width, height },
        },
      }: LayoutChangeEvent) => {
        setDimensions({ width, height });
      },
      []
    );

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View onLayout={handleOnLayout} style={styles.container}>
          <Background
            animatedIndex={animatedIndex}
            data={data}
            safeInsets={safeInsets}
            screenDimensions={dimensions}
            indicatorSize={indicatorSize}
            animatedIndicatorsContainerPosition={
              animatedIndicatorsContainerPosition
            }
          />

          {data.map((item, index) => (
            <Page
              key={`page-${index}`}
              index={index}
              item={item}
              animatedIndex={animatedIndex}
              indicatorSize={indicatorSize}
              titleStyle={titleStyle}
              descriptionStyle={descriptionStyle}
              safeInsets={safeInsets}
              screenDimensions={dimensions}
            />
          ))}

          <IndicatorsContainer
            data={data}
            animatedIndex={animatedIndex}
            animatedIndicatorsContainerPosition={
              animatedIndicatorsContainerPosition
            }
            indicatorSize={indicatorSize}
            indicatorBackgroundColor={indicatorBackgroundColor}
            indicatorBorderColor={indicatorBorderColor}
            safeInsets={safeInsets}
          />

          <CloseButton
            data={data}
            animatedIndex={animatedIndex}
            safeInsets={safeInsets}
            closeButtonText={closeButtonText}
            closeButtonTextStyle={closeButtonTextStyle}
            closeButton={closeButton}
            onCloseButtonPress={onCloseButtonPress}
          />
        </Animated.View>
      </GestureDetector>
    );
  }
);

const PaperOnboarding = memo(PaperOnboardingComponent);

export default PaperOnboarding;
