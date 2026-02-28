import { onboardingRepository } from '../repository';

export const onboardingService = {
  getIntroContent() {
    return onboardingRepository.getIntroContent();
  },
};
