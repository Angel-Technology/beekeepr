import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { FlatList, ListRenderItem, ViewToken } from 'react-native';
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

type OnboardingPagerProps<TItem> = {
  data: TItem[];
  title: string;
  subtitle: string;
  keyExtractor: (item: TItem, index: number) => string;
  renderSlide: (args: {
    item: TItem;
    index: number;
    x: SharedValue<number>;
    screenWidth: number;
  }) => ReactNode;
  onExit: () => void;
  onComplete?: () => void;
};

export function OnboardingPager<TItem>({
  data,
  title,
  subtitle,
  keyExtractor,
  renderSlide,
  onExit,
  onComplete,
}: OnboardingPagerProps<TItem>) {
  const { width: deviceWidth } = useWindowDimensions();
  const screenWidth = Math.min(deviceWidth, 500);
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

  const scrollToIndex = (index: number) => {
    jsFlatListRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      onExit();
      return;
    }

    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex === data.length - 1) {
      onComplete?.();
      return;
    }

    scrollToIndex(currentIndex + 1);
  };

  const renderItem: ListRenderItem<TItem> = ({ item, index }) => (
    <View style={{ width: screenWidth }}>
      {renderSlide({ item, index, x, screenWidth })}
    </View>
  );

  return (
    <Container
      safeArea
      // safeAreaEdges={['top', 'bottom']}
      className="items-center bg-bg-default"
    >
      <View className="flex-1 gap-6">
        <VerticalSpacer size="xs" />
        <View className="w-full gap-2 self-stretch">
          <Text className="font-poppins-semiBold text-800 leading-600 text-text-default">
            {title}
          </Text>
          <Text className="font-sourceSans-regular text-400 leading-300 tracking-tighter text-text-secondary">
            {subtitle}
          </Text>
        </View>

        <Animated.FlatList
          ref={(node) => {
            jsFlatListRef.current = node;
            flatListRef(node);
          }}
          className="flex-1"
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
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
      </View>
      <VerticalSpacer size="xl" />

      <View className="flex flex-row items-center justify-center self-stretch">
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

        <OnboardingPagination itemCount={data.length} x={x} />

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
}
