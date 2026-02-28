export type OnboardingIntroStep = {
  id: string;
  title: string;
  description: string;
};

export type OnboardingIntroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  steps: OnboardingIntroStep[];
};
