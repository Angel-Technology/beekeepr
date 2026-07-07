import { useOnboardingWhatWeDo } from '../../hooks/useOnboardingWhatWeDo';
import { OnboardingWhatWeDoBody } from '../components/OnboardingWhatWeDoBody';

/**
 * Connected wrapper for the onboarding "what we do" carousel. Pulls the
 * finish handler from `useOnboardingWhatWeDo` and forwards it into
 * `OnboardingWhatWeDoBody`, which owns the three-slide `PaperOnboarding`
 * composition.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what the
 * screen looks like, and Storybook renders that body directly. Extracting
 * it from the screen means there's no parallel preview composition to
 * keep in sync — same pixels in production and in stories.
 */
export const OnboardingWhatWeDoScreen = () => {
  const { handleFinish } = useOnboardingWhatWeDo();

  return <OnboardingWhatWeDoBody onFinish={handleFinish} />;
};
