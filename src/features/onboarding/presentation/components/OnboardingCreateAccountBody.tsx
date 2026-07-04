import { View } from 'react-native';
import { Image } from 'expo-image';

import { appImages } from '@assets/images';
import { themedColors, useThemedColor } from '@common';
import AppleIcon from '@assets/svg/AppleIcon';
import GoogleIcon from '@assets/svg/GoogleIcon';
import { BrandMark, Button, Container, VerticalSpacer } from '@components';

type OnboardingCreateAccountBodyProps = {
  /**
   * Whether to render the "Continue with Apple" button. In production
   * this is `true` on iOS and `false` everywhere else — the connecting
   * hook reads `Platform.OS` so the body has no platform branch of its
   * own.
   */
  showAppleButton: boolean;
  /**
   * Apple sign-in mutation pending state. Drives the Apple button's
   * spinner while the native sheet is open.
   */
  isApplePending: boolean;
  /**
   * Google sign-in mutation pending state. Drives the Google button's
   * spinner while the native sheet is open.
   */
  isGooglePending: boolean;
  onContinueWithApple: () => void;
  onContinueWithGoogle: () => void;
  onContinueWithEmail: () => void;
};

/**
 * Pure presentation layer for the onboarding "create account" screen.
 * Renders the brand mark, the "Let's do this" illustration, and the
 * social auth + email CTAs.
 *
 * Reads no feature hooks — only `useThemedColor` for the Apple icon tint,
 * which is a pure theme helper. The connected screen
 * (`OnboardingCreateAccountScreen`) wraps this with
 * `useOnboardingCreateAccount` and passes the platform flag, pending
 * states, and navigation callbacks in. Stories render this body directly
 * with stubs — no router or auth provider mocks needed.
 */
export const OnboardingCreateAccountBody = ({
  showAppleButton,
  isApplePending,
  isGooglePending,
  onContinueWithApple,
  onContinueWithGoogle,
  onContinueWithEmail,
}: OnboardingCreateAccountBodyProps) => {
  const appleIconColor = useThemedColor(themedColors.text.primary);

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-tk-bg-primary flex-1"
    >
      <VerticalSpacer size="lg" />
      <BrandMark />

      <View className="w-full flex-1 items-center justify-end self-stretch">
        <Image
          source={appImages.illustrationLetsdothis}
          contentFit="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View className="w-full gap-4 pb-4">
        {showAppleButton ? (
          <Button
            label="Continue with Apple"
            variant="outline"
            iconLeft={<AppleIcon color={appleIconColor} />}
            loading={isApplePending}
            onPress={onContinueWithApple}
          />
        ) : null}
        <Button
          label="Continue with Google"
          variant="outline"
          iconLeft={<GoogleIcon />}
          loading={isGooglePending}
          onPress={onContinueWithGoogle}
        />
        <Button label="Continue with Email" onPress={onContinueWithEmail} />
      </View>
    </Container>
  );
};
