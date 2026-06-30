import { useCallback, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Menu, UserRound } from 'lucide-react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  BOTTOM_TAB_BAR_HEIGHT,
  IconButton,
} from '@components';
import {
  isRenderableAvatarUrl,
  storageKeys,
  themedColors,
  useDismissibleOnce,
  useThemedColor,
} from '@common';
import { PromoCodeModal } from '@features/account/presentation/components/PromoCodeModal';
import { useAuthSession } from '@features/auth';
import { appAnimations } from '@src/assets/animations';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useBuzzTab } from '../../hooks/useBuzzTab';
import {
  BuzzMembershipFlow,
  BuzzRenewalFlow,
  BuzzSafetyDisclaimerModal,
  BuzzScreeningDeniedCard,
  BuzzScreenSkeleton,
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
  const router = useRouter();
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
    isRefreshing,
    onRefresh,
  } = useBuzzTab();
  const { data: user } = useAuthSession();
  // Only render avatars `SvgUri` can actually parse. Backend currently
  // stores Google / Apple `picture` URLs (raster) on social sign-in,
  // and `SvgUri` crashes mid-render on those. See
  // `isRenderableAvatarUrl` for the predicate's why.
  const profileImageUrl = isRenderableAvatarUrl(user?.imageUrl)
    ? user.imageUrl
    : null;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const menuIconColor = useThemedColor(themedColors.text.primary);

  const safetyDisclaimer = useDismissibleOnce(storageKeys.safetyDisclaimer);
  // Per-visit suppression: dismissing without checking "Don't show again"
  // hides the modal for the current focus session, but the next time the
  // user lands on this screen it pops again — that's the focus-effect
  // reset below. Checking the box flips `hasSeen` instead, which sticks.
  const [safetyDismissedThisVisit, setSafetyDismissedThisVisit] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      setSafetyDismissedThisVisit(false);
    }, []),
  );

  const showSafetyDisclaimer =
    flow === 'welcome' &&
    safetyDisclaimer.hasSeen === false &&
    !safetyDismissedThisVisit;

  const handleSafetyDismiss = (shouldPersist: boolean) => {
    setSafetyDismissedThisVisit(true);
    if (shouldPersist) {
      safetyDisclaimer.markSeen();
    }
  };

  const renderFlow = () => {
    switch (flow) {
      case null:
        // Wait for the auth session + RevenueCat customer info to land
        // before picking a flow — otherwise we flash 'verify' or
        // 'membership' for ~500ms before snapping to 'welcome' once
        // `isPro` resolves. The skeleton mirrors the dominant-case
        // `welcome` layout so we don't shift content as the real flow
        // takes over.
        return <BuzzScreenSkeleton />;
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
    <View className="bg-tk-bg-primary flex-1">
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={menuIconColor}
            progressViewOffset={headerOffset}
          />
        }
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

      <BuzzSafetyDisclaimerModal
        visible={showSafetyDisclaimer}
        onClose={handleSafetyDismiss}
      />

      <AppHeader
        floating
        topInset={insets.top}
        animatedStyle={headerAnimatedStyle}
        showTopMask
        topMaskHeight={topMaskHeight}
        left={
          <View className="pl-5">
            <IconButton
              accessibilityLabel="Open profile"
              className="bg-tk-bg-primary border-tk-border-secondary size-[30px] overflow-hidden rounded-round border p-0"
              icon={
                profileImageUrl ? (
                  <SvgUri uri={profileImageUrl} width={28} height={28} />
                ) : (
                  <UserRound
                    size={18}
                    strokeWidth={2.2}
                    color={menuIconColor}
                  />
                )
              }
              onPress={() => router.push('/profile')}
            />
          </View>
        }
        center={
          <View className="flex-row items-start justify-center gap-1">
            <Text className="text-tk-text-primary font-poppins-semiBold text-base">
              Buzz Badge
            </Text>
          </View>
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
