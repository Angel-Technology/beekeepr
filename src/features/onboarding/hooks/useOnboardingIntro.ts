import { onboardingService } from '../services';

export function useOnboardingIntro() {
  const content = onboardingService.getIntroContent();

  return {
    content,
    isLoading: false,
  };
}
