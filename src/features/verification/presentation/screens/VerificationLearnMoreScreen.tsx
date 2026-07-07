import { useVerificationLearnMore } from '../../hooks/useVerificationLearnMore';
import { VerificationLearnMoreBody } from '../components/VerificationLearnMoreBody';

/**
 * Connected wrapper for the "30-Day Free Trial" learn-more screen. Pulls
 * the reminder + trial-end labels and the navigation handlers from
 * `useVerificationLearnMore`, then passes them into
 * `VerificationLearnMoreBody` for rendering.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to keep
 * in sync — same pixels in production and in stories.
 */
export const VerificationLearnMoreScreen = () => {
  const { reminderLabel, trialEndLabel, handleGetStarted, handleGoBack } =
    useVerificationLearnMore();

  return (
    <VerificationLearnMoreBody
      reminderLabel={reminderLabel}
      trialEndLabel={trialEndLabel}
      onGetStarted={handleGetStarted}
      onGoBack={handleGoBack}
    />
  );
};
