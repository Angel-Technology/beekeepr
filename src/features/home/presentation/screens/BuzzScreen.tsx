import { useCallback, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import {
  isRenderableAvatarUrl,
  storageKeys,
  useDismissibleOnce,
} from '@common';
import { useAuthSession } from '@features/auth';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useBuzzTab } from '../../hooks/useBuzzTab';
import { BuzzBody } from '../components/BuzzBody';

/**
 * Connected wrapper for the Buzz tab — the post-auth landing screen on
 * the bottom-tab navigation. Owns the router + drawer navigation,
 * `useBuzzTab` (flow derivation + CTA + refresh), the auth session
 * (for the profile avatar), and the per-visit / persistent
 * safety-disclaimer suppression logic. Everything else is passed as
 * props into `BuzzBody`.
 *
 * Safety-disclaimer behavior: dismissing without checking "Don't show
 * again" hides the modal for the current focus session, but the next
 * time the user lands on this screen it pops again — that's the
 * focus-effect reset below. Checking the box flips `hasSeen` instead,
 * which sticks.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the screen looks like, and Storybook renders that body directly.
 * Extracting the hooks out of the presentation means there's no
 * parallel preview composition to keep in sync — same pixels in
 * production and in stories.
 */
export const BuzzScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

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

  return (
    <BuzzBody
      flow={flow}
      ctaLabel={ctaLabel}
      onGetStarted={onGetStarted}
      onLearnMore={onLearnMore}
      membershipProps={membershipProps}
      renewalProps={renewalProps}
      welcomeProps={welcomeProps}
      promoModalProps={promoModalProps}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      profileImageUrl={profileImageUrl}
      onOpenProfile={() => router.push('/profile')}
      onOpenMenu={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      onAppealDecision={() => openInAppBrowser(environmentConfig.supportURL)}
      showSafetyDisclaimer={showSafetyDisclaimer}
      onDismissSafetyDisclaimer={handleSafetyDismiss}
    />
  );
};
