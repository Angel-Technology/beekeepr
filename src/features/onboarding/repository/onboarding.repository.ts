import type { OnboardingIntroContent } from '../models';

const onboardingIntroContent: OnboardingIntroContent = {
  eyebrow: 'Welcome',
  title: 'Beekeepr',
  description:
    'Manage your hive, your routine, and the work that keeps everything moving.',
  primaryActionLabel: 'Get Started',
  secondaryActionLabel: 'I Already Have an Account',
  steps: [
    {
      id: 'organize',
      title: 'Organize your workflow',
      description: 'Track what matters and keep your day in one place.',
    },
    {
      id: 'bookings',
      title: 'Stay on top of clients',
      description: 'Capture the details you need before things slip.',
    },
    {
      id: 'grow',
      title: 'Build a system that scales',
      description:
        'Start with a clean setup and grow into the product naturally.',
    },
  ],
};

export const onboardingRepository = {
  getIntroContent(): OnboardingIntroContent {
    return onboardingIntroContent;
  },
};
