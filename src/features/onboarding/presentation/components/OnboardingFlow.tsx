import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import type {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { Container, VerticalSpacer } from '@components';
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
  onComplete,
}: OnboardingFlowProps<TItem>) => {
  const { width: deviceWidth } = useWindowDimensions();
  const fallbackPageWidth = Math.min(deviceWidth - 48, 500);
  const [pageWidth, setPageWidth] = useState(fallbackPageWidth);
  const flatListRef = useAnimatedRef<FlatList<TItem>>();
  const jsFlatListRef = useRef<FlatList<TItem> | null>(null);
  const x = useSharedValue(0);
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

      setCurrentIndex(nextIndex);
    },
    [],
  );

  const handlePageWidthLayout = useCallback(
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
      return;
    }

    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === data.length - 1) {
      onComplete?.();
      return;
    }

    scrollToIndex(currentIndex + 1);
  }, [currentIndex, data.length, onComplete, scrollToIndex]);

  const renderItem: ListRenderItem<TItem> = ({ item, index }) => (
    <View style={{ width: pageWidth }} className="px-lg">
      {renderSlide({ item, index, x, pageWidth })}
    </View>
  );

  return (
    <Container safeArea className="items-center bg-bg-default px-0">
      <View
        className="w-full max-w-[500px] flex-1 gap-7"
        onLayout={handlePageWidthLayout}
      >
        <View className="gap-2 self-stretch px-lg">
          <Text className="font-poppins-semiBold text-800 text-text-default">
            {title}
          </Text>
          <Text className="font-sourceSans-regular text-400 text-text-secondary">
            {subtitle}
          </Text>
        </View>
        <Animated.FlatList
          ref={(node) => {
            jsFlatListRef.current = node;
            flatListRef(node);
          }}
          className="flex-1 self-stretch"
          contentContainerStyle={{
            alignItems: 'stretch',
          }}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          bounces={false}
          onScroll={onScroll}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 200,
            viewAreaCoveragePercentThreshold: 50,
          }}
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
      <OnboardingPagination
        backAccessibilityLabel={
          currentIndex === 0 ? 'Previous slide unavailable' : 'Previous slide'
        }
        backDisabled={currentIndex === 0}
        className="px-lg"
        itemCount={data.length}
        nextAccessibilityLabel={
          currentIndex === data.length - 1 ? 'Finish onboarding' : 'Next slide'
        }
        nextDisabled={currentIndex === data.length - 1 && !onComplete}
        onBack={handleBack}
        onNext={handleNext}
        pageWidth={pageWidth}
        x={x}
      />
    </Container>
  );
};
