import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import clsx from 'clsx';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IntroBrandLockup from '@assets/svg/IntroBrandLockup';
import { Button, Container } from '@components';
import { colors } from '@common/colors';
import { VerificationStatusPill } from '../components/VerificationStatusPill';

export const OnboardingIntroScreen = () => {
  const router = useRouter();

  return (
    <Container
      safeArea
      safeAreaEdges={['top']}
      className={clsx('flex-1 bg-bg-default')}
    >
      <View className="flex-1 items-center justify-center gap-8 self-stretch">
        <View className="items-center justify-center">
          <IntroBrandLockup width={169} height={189} />
        </View>

        <View className="items-center gap-lg self-stretch">
          <VerificationStatusPill label="ID verified / No criminal records" />

          <Text className="font-poppins-semiBold text-800 text-text-default">
            Stand out in the crowd!
          </Text>
          <Text className="text-center font-poppins-regular text-500 text-text-default">
            It’s proven that people with visible trust signals receive more
            engagement.
          </Text>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} className="mt-auto w-full">
        <View className="w-full pb-4">
          <Button
            label="So, whatz the buzz?"
            className="w-full"
            onPress={() => router.replace('/onboarding/what-we-do')}
            iconRight={
              <ArrowRight
                color={colors.action.neutral.text.onAction}
                size={20}
                strokeWidth={2.25}
              />
            }
          />
        </View>
      </SafeAreaView>
    </Container>
  );
};
