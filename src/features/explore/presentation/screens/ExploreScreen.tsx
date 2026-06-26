import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
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
import { DATING_ADVICE } from '../../models/datingAdvice';
import { DatingAdviceCard } from '../components/DatingAdviceCard';

export const ExploreScreen = () => {
  const navigation = useNavigation();
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
    <View className="bg-tk-bg-primary flex-1">
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
        {DATING_ADVICE.map((item) => (
          <DatingAdviceCard
            key={item.id}
            title={item.title}
            statistic={item.statistic}
            source={item.source}
            advice={item.advice}
          />
        ))}
        <VerticalSpacer size="3xl" />
      </Animated.ScrollView>

      <AppHeader
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        center={
          <Text className="text-tk-text-primary font-poppins-semiBold text-base">
            Explore
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color={menuIconColor} />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />
    </View>
  );
};
