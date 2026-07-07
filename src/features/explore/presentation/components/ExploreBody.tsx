import { Text, View } from 'react-native';
import { Menu } from 'lucide-react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  BOTTOM_TAB_BAR_HEIGHT,
  IconButton,
  SafetyDisclaimerCard,
  VerticalSpacer,
} from '@components';
import { themedColors, useThemedColor } from '@common';
import { DatingAdviceCard } from './DatingAdviceCard';

type DatingAdviceItem = {
  readonly id: string;
  readonly title: string;
  readonly statistic: string;
  readonly source: string;
  readonly advice: readonly string[];
};

type ExploreBodyProps = {
  /**
   * Ordered dating-advice tiles rendered below the safety disclaimer.
   * Static content from the feature's `models/datingAdvice.ts` in
   * production — passed in as data so stories can substitute fixtures.
   */
  items: readonly DatingAdviceItem[];
  /** Toggles the right-side drawer via the parent screen. */
  onOpenMenu: () => void;
};

/**
 * Pure presentation body for the Explore tab. Renders the collapsing
 * `AppHeader` (title + hamburger menu), the shared `SafetyDisclaimerCard`,
 * and one `DatingAdviceCard` per item.
 *
 * Reads no feature hooks — only theming (`useThemedColor`) and safe-area
 * (`useSafeAreaInsets`) helpers. The connected `ExploreScreen` supplies
 * the static advice list plus the drawer-toggle callback. Stories render
 * this body directly with stub callbacks and can pass tailored `items`
 * fixtures via the controls panel.
 */
export const ExploreBody = ({ items, onOpenMenu }: ExploreBodyProps) => {
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;

  const menuIconColor = useThemedColor(themedColors.text.primary);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, headerOffset],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateY: -progress * headerOffset }],
      opacity: 1 - progress,
    };
  });

  return (
    <View className="flex-1 bg-tk-bg-primary">
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: headerOffset + 8,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
          gap: 24,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <SafetyDisclaimerCard />
        {items.map((item) => (
          <DatingAdviceCard
            key={item.id}
            title={item.title}
            statistic={item.statistic}
            source={item.source}
            advice={item.advice}
          />
        ))}
        <VerticalSpacer size="md" />
      </Animated.ScrollView>

      <AppHeader
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        center={
          <Text className="font-poppins-semiBold text-base text-tk-text-primary">
            Explore
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color={menuIconColor} />}
            onPress={onOpenMenu}
          />
        }
      />
    </View>
  );
};

export type { DatingAdviceItem };
