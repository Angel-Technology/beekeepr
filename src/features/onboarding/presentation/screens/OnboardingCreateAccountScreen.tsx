import { useOnboardingCreateAccount } from '../../hooks/useOnboardingCreateAccount';
import { OnboardingCreateAccountBody } from '../components/OnboardingCreateAccountBody';

/**
 * Connected wrapper for the onboarding "create account" screen. Pulls
 * the platform flag, sign-in pending states, and navigation handlers
 * from `useOnboardingCreateAccount`, then passes them into
 * `OnboardingCreateAccountBody` for rendering.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to
 * keep in sync — same pixels in production and in stories.
 */
export const OnboardingCreateAccountScreen = () => {
  const {
    showAppleButton,
    isApplePending,
    isGooglePending,
    handleContinueWithApple,
    handleContinueWithGoogle,
    handleContinueWithEmail,
  } = useOnboardingCreateAccount();

  return (
    <OnboardingCreateAccountBody
      showAppleButton={showAppleButton}
      isApplePending={isApplePending}
      isGooglePending={isGooglePending}
      onContinueWithApple={handleContinueWithApple}
      onContinueWithGoogle={handleContinueWithGoogle}
      onContinueWithEmail={handleContinueWithEmail}
    />
  );
};
