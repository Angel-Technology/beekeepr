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
} from '@components';
import {
  DatingAppsExploreCard,
  PartnershipExploreCard,
  STIScreeningExploreCard,
  SurvivorSupportExploreCard,
} from '../components';

export const ExploreScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;

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
    <View className="flex-1 bg-bg-default">
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: headerOffset + 8,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
          gap: 16,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <PartnershipExploreCard />
        <DatingAppsExploreCard />
        <STIScreeningExploreCard />
        <SurvivorSupportExploreCard />
      </Animated.ScrollView>

      <AppHeader
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            Explore
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color="#000000" />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />
    </View>
  );
};
