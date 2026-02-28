import { Text, View } from 'react-native';

import type { OnboardingIntroStep } from '../../models';

type OnboardingIntroStepCardProps = {
  step: OnboardingIntroStep;
};

export function OnboardingIntroStepCard({
  step,
}: OnboardingIntroStepCardProps) {
  return (
    <View className="rounded-lg border border-border-subtle bg-bg-primarySubtle p-md">
      <Text className="font-poppins-semiBold text-300 text-text-default">
        {step.title}
      </Text>
      <Text className="mt-xs font-sourceSans-regular text-200 text-text-secondary">
        {step.description}
      </Text>
    </View>
  );
}
