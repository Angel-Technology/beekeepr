import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOnboardingIntro } from '../../hooks';
import { OnboardingIntroStepCard } from '../components';

export function OnboardingIntroScreen() {
  const { content } = useOnboardingIntro();

  return (
    <SafeAreaView className="flex-1 bg-bg-default">
      <View className="flex-1 px-lg py-xl">
        <View className="gap-sm">
          <Text className="font-sourceSans-semiBold text-200 uppercase tracking-tight text-text-primary">
            {content.eyebrow}
          </Text>
          <Text className="font-poppins-bold text-1100 leading-1100 text-text-default">
            {content.title}
          </Text>
          <Text className="max-w-[320px] font-sourceSans-regular text-300 leading-400 text-text-secondary">
            {content.description}
          </Text>
        </View>

        <View className="mt-xl gap-sm">
          {content.steps.map((step) => (
            <OnboardingIntroStepCard key={step.id} step={step} />
          ))}
        </View>

        <View className="mt-auto rounded-xl bg-brand-primary px-lg py-md">
          <Text className="text-center font-poppins-semiBold text-300 text-text-inverse">
            {content.primaryActionLabel}
          </Text>
        </View>

        <Text className="mt-sm text-center font-sourceSans-semiBold text-200 text-text-primary">
          {content.secondaryActionLabel}
        </Text>
      </View>
    </SafeAreaView>
  );
}
