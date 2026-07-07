import type { ComponentProps } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
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
import { themedColors, useThemedColor } from '@common';
import { PromoCodeModal } from '@features/account/presentation/components/PromoCodeModal';
import { appAnimations } from '@src/assets/animations';
import type { BuzzFlow } from '../../models/buzzFlow.types';
import { BuzzMembershipFlow } from './BuzzMembershipFlow';
import { BuzzRenewalFlow } from './BuzzRenewalFlow';
import { BuzzSafetyDisclaimerModal } from './BuzzSafetyDisclaimerModal';
import { BuzzScreeningDeniedCard } from './BuzzScreeningDeniedCard';
import { BuzzScreenSkeleton } from './BuzzScreenSkeleton';
import { BuzzVerifyFlow } from './BuzzVerifyFlow';
import { BuzzWelcomeFlow } from './BuzzWelcomeFlow';

// Wrapping with `createAnimatedComponent` lets us drive a Reanimated scroll
// handler (UI-thread) against the keyboard-aware scroll view from
// `react-native-keyboard-controller`.
const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

type MembershipProps = ComponentProps<typeof BuzzMembershipFlow>;
type RenewalProps = ComponentProps<typeof BuzzRenewalFlow>;
type WelcomeProps = ComponentProps<typeof BuzzWelcomeFlow>;
type PromoModalProps = ComponentProps<typeof PromoCodeModal>;

type BuzzBodyProps = {
  /**
   * Which of the five render variants to draw, or `null` while the auth
   * session + RevenueCat customer info are still resolving (renders the
   * skeleton). Derived by `useBuzzTab` from the badge state + `isPro` flag.
   */
  flow: BuzzFlow | null;
  /** Primary CTA copy for the verify / denied flow. */
  ctaLabel: string;
  /** Primary CTA press for the verify / denied flow. */
  onGetStarted: () => void;
  /**
   * Secondary "Learn more" CTA for the verify flow. Omitted when the
   * primary CTA already points at the learn-more screen (approved but
   * not subscribed).
   */
  onLearnMore?: () => void;
  membershipProps: MembershipProps;
  renewalProps: RenewalProps;
  welcomeProps: WelcomeProps;
  /** Props for the shared promo-code modal (visible + form + close). */
  promoModalProps: PromoModalProps;
  /** True while the pull-to-refresh spinner should stay visible. */
  isRefreshing: boolean;
  /** Fires when the user pulls down to refresh. */
  onRefresh: () => void;
  /**
   * Optional avatar URL rendered in the top-left profile icon. Should
   * already be filtered by `isRenderableAvatarUrl` — the body renders
   * whatever it receives via `SvgUri`.
   */
  profileImageUrl: string | null;
  /** Tapping the profile icon (top-left of the app header). */
  onOpenProfile: () => void;
  /** Tapping the hamburger (top-right of the app header). */
  onOpenMenu: () => void;
  /** Denial-card "Contact Support" tap. Wraps `openInAppBrowser` in prod. */
  onAppealDecision: () => void;
  /**
   * Whether the safety-disclaimer modal should be visible. Owned by the
   * connected screen (per-visit + persistent dismiss logic).
   */
  showSafetyDisclaimer: boolean;
  /**
   * Fires when the safety modal is dismissed. `shouldPersist` mirrors
   * the "Don't show this to me again" checkbox at the moment of close.
   */
  onDismissSafetyDisclaimer: (shouldPersist: boolean) => void;
};

/**
 * Pure presentation body for the Buzz tab — the post-auth landing
 * screen on the bottom-tab navigation. Renders whichever of the five
 * flow variants the parent hook resolves to, the confetti overlay for
 * new memberships, the shared promo-code modal, the safety-disclaimer
 * modal, and the collapsing `AppHeader`.
 *
 * Reads no feature hooks — only theming (`useThemedColor`) and safe-area
 * (`useSafeAreaInsets`) helpers. The connected `BuzzScreen` runs
 * `useBuzzTab` + `useAuthSession` + `useDismissibleOnce` and forwards
 * their outputs. Stories render this body directly with fixture data
 * per flow variant — no router, TanStack Query, or RevenueCat provider
 * mocks needed.
 */
export const BuzzBody = ({
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
  profileImageUrl,
  onOpenProfile,
  onOpenMenu,
  onAppealDecision,
  showSafetyDisclaimer,
  onDismissSafetyDisclaimer,
}: BuzzBodyProps) => {
  const insets = useSafeAreaInsets();
  const headerOffset = APP_HEADER_HEIGHT + insets.top;
  const topMaskHeight = headerOffset + 8;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const menuIconColor = useThemedColor(themedColors.text.primary);

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
            <BuzzScreeningDeniedCard onAppealDecision={onAppealDecision} />
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
    <View className="flex-1 bg-tk-bg-primary">
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
        onClose={onDismissSafetyDisclaimer}
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
              className="size-[30px] overflow-hidden rounded-round border border-tk-border-secondary bg-tk-bg-primary p-0"
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
              onPress={onOpenProfile}
            />
          </View>
        }
        center={
          <View className="flex-row items-start justify-center gap-1">
            <Text className="font-poppins-semiBold text-base text-tk-text-primary">
              Buzz Badge
            </Text>
          </View>
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

export type { BuzzBodyProps };
