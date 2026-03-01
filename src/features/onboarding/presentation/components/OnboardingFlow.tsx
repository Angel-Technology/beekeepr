import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import { Text, useWindowDimensions, View } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { Container, IconButton, VerticalSpacer } from '@components';
import { colors } from '@common/colors';
import { OnboardingPagination } from './OnboardingPagination';

type OnboardingFlowProps<TItem> = {
  data: TItem[];
  title: string;
  subtitle: string;
  keyExtractor: (item: TItem, index: number) => string;
  renderSlide: (args: {
    item: TItem;
    index: number;
    x: SharedValue<number>;
    pageWidth: number;
  }) => ReactNode;
  onExit: () => void;
  onComplete?: () => void;
};

export const OnboardingFlow = <TItem,>({
  data,
  title,
  subtitle,
  keyExtractor,
  renderSlide,
  onExit,
  onComplete,
}: OnboardingFlowProps<TItem>) => {
  const { width: deviceWidth } = useWindowDimensions();
  const fallbackPageWidth = Math.min(deviceWidth - 48, 500);
  const [pageWidth, setPageWidth] = useState(fallbackPageWidth);
  const flatListRef = useAnimatedRef<FlatList<TItem>>();
  const jsFlatListRef = useRef<FlatList<TItem> | null>(null);
  const x = useSharedValue(0);
  const activeIndex = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const nextIndex = viewableItems[0]?.index;

      if (nextIndex === undefined || nextIndex === null) {
        return;
      }

      activeIndex.value = nextIndex;
      setCurrentIndex(nextIndex);
    },
    [activeIndex],
  );

  const viewabilityConfig = useMemo(
    () => ({
      minimumViewTime: 200,
      viewAreaCoveragePercentThreshold: 50,
    }),
    [],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = Math.min(event.nativeEvent.layout.width, 500);

      if (!nextWidth || nextWidth === pageWidth) {
        return;
      }

      setPageWidth(nextWidth);
    },
    [pageWidth],
  );

  const scrollToIndex = useCallback((index: number) => {
    jsFlatListRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  }, []);

  const handleBack = useCallback(() => {
    if (currentIndex === 0) {
      onExit();
      return;
    }

    scrollToIndex(currentIndex - 1);
  }, [currentIndex, onExit, scrollToIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === data.length - 1) {
      onComplete?.();
      return;
    }

    scrollToIndex(currentIndex + 1);
  }, [currentIndex, data.length, onComplete, scrollToIndex]);

  const renderItem: ListRenderItem<TItem> = ({ item, index }) => (
    <View style={{ width: pageWidth }}>
      {renderSlide({ item, index, x, pageWidth })}
    </View>
  );

  return (
    <Container safeArea className="items-center bg-bg-default">
      <View className="flex-1 w-full max-w-[500px]" onLayout={handleLayout}>
        <View className="gap-2 self-stretch">
          <Text className="font-poppins-semiBold text-800 text-text-default">
            {title}
          </Text>
          <Text className="font-sourceSans-regular text-400 text-text-secondary">
            {subtitle}
          </Text>
        </View>

        <VerticalSpacer size="lg" />

        <Animated.FlatList
          ref={(node) => {
            jsFlatListRef.current = node;
            flatListRef(node);
          }}
          className="flex-1 self-stretch"
          contentContainerStyle={{ alignItems: 'stretch' }}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          bounces={false}
          onScroll={onScroll}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: pageWidth,
            offset: pageWidth * index,
            index,
          })}
        />
      </View>

      <VerticalSpacer size="xl" />

      <View className="w-full max-w-[500px] flex-row items-center justify-between">
        <IconButton
          accessibilityLabel={
            currentIndex === 0 ? 'Previous slide unavailable' : 'Previous slide'
          }
          disabled={currentIndex === 0}
          icon={
            <ArrowLeft
              color={colors.text.secondary}
              size={20}
              strokeWidth={2.25}
            />
          }
          onPress={handleBack}
          variant="outline"
        />

        <OnboardingPagination itemCount={data.length} pageWidth={pageWidth} x={x} />

        <IconButton
          accessibilityLabel={
            currentIndex === data.length - 1
              ? 'Finish onboarding'
              : 'Next slide'
          }
          icon={
            <ArrowRight
              color={colors.action.neutral.text.onAction}
              size={20}
              strokeWidth={2.25}
            />
          }
          onPress={handleNext}
        />
      </View>
    </Container>
  );
};
