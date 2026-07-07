import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthActions } from '@features/auth';

const EMAIL_ROUTE = '/auth/create-account-email';

/**
 * State + handlers for the onboarding "create account" screen — the
 * social-auth entry point that follows the "what we do" carousel.
 *
 * Responsibilities:
 * - Surface the platform-appropriate social auth buttons (Apple is only
 *   available on iOS; Android sees Google + Email only).
 * - Expose the pending state of each social sign-in mutation so the button
 *   can show a spinner while the native sheet is up.
 * - Route the "Continue with Email" tap into the email-code flow.
 *
 * The connected screen (`OnboardingCreateAccountScreen`) wraps this hook
 * and forwards its outputs into `OnboardingCreateAccountBody`. Stories
 * render the body directly with stubs — no router or auth provider mocks
 * needed.
 */
export const useOnboardingCreateAccount = () => {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuthActions();

  return {
    /**
     * Whether the Apple-sign-in button should be rendered. Apple is only
     * available on iOS — Android builds hide it entirely.
     */
    showAppleButton: Platform.OS === 'ios',
    isApplePending: signInWithApple.isPending,
    isGooglePending: signInWithGoogle.isPending,
    handleContinueWithApple: () => {
      signInWithApple.mutate();
    },
    handleContinueWithGoogle: () => {
      signInWithGoogle.mutate();
    },
    handleContinueWithEmail: () => {
      router.push(EMAIL_ROUTE);
    },
  };
};
