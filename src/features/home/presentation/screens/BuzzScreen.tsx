import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Menu } from 'lucide-react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  BOTTOM_TAB_BAR_HEIGHT,
  BounceLoader,
  IconButton,
} from '@components';
import { PromoCodeModal } from '@features/account/presentation/components/PromoCodeModal';
import { appAnimations } from '@src/assets/animations';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useBuzzTab } from '../../hooks/useBuzzTab';
import {
  BuzzActiveFlow,
  BuzzMembershipFlow,
  BuzzRenewalFlow,
  BuzzScreeningDeniedCard,
  BuzzVerifyFlow,
  BuzzWelcomeFlow,
} from '../components';

// Wrapping with `createAnimatedComponent` lets us drive a Reanimated scroll
// handler (UI-thread) against the keyboard-aware scroll view from
// `react-native-keyboard-controller`.
const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

export const BuzzScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;

  const {
    flow,
    ctaLabel,
    onGetStarted,
    onLearnMore,
    membershipProps,
    renewalProps,
    welcomeProps,
    promoModalProps,
    resetSubmittedBackgroundCheck,
  } = useBuzzTab();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderFlow = () => {
    switch (flow) {
      case null:
        // Wait for the auth session + RevenueCat customer info to land
        // before picking a flow — otherwise we flash 'verify' or
        // 'membership' for ~500ms before snapping to 'welcome' once
        // `isPro` resolves.
        return (
          <View className="flex-1 items-center justify-center py-24">
            <BounceLoader colorClassName="bg-text-default" />
          </View>
        );
      case 'denied':
        return (
          <>
            <BuzzScreeningDeniedCard
              onAppealDecision={() =>
                openInAppBrowser(environmentConfig.supportURL)
              }
            />
            <BuzzVerifyFlow
              ctaLabel={ctaLabel}
              onGetStarted={onGetStarted}
              onLearnMore={onLearnMore}
              flow={flow}
            />
          </>
        );
      case 'verify':
        return (
          <BuzzVerifyFlow
            ctaLabel={ctaLabel}
            onGetStarted={onGetStarted}
            onLearnMore={onLearnMore}
            flow={flow}
          />
        );
      case 'membership':
        return <BuzzMembershipFlow {...membershipProps} />;
      case 'renewal':
        return <BuzzRenewalFlow {...renewalProps} />;
      case 'welcome':
        return <BuzzWelcomeFlow {...welcomeProps} />;
      case 'active':
        return (
          <BuzzActiveFlow
            onReviewSubmittedInfo={() => {
              resetSubmittedBackgroundCheck();
            }}
          />
        );
    }
  };

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
      <AnimatedKeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: headerOffset + 8,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
          gap: 16,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        {renderFlow()}
      </AnimatedKeyboardAwareScrollView>

      {flow === 'membership' ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LottieView
            source={appAnimations.confetti}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}

      <PromoCodeModal {...promoModalProps} />

      <AppHeader
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        center={
          <View className="flex-row items-start justify-center gap-1">
            <Text className="font-poppins-semiBold text-base text-text-default">
              Buzz Badge
            </Text>
            <View className="items-center justify-center rounded bg-brand-highlight px-[3px] py-[1px]">
              <Text className="font-sourceSans-semiBold text-[7px] text-text-default">
                BETA
              </Text>
            </View>
          </View>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />
    </View>
  );
};
