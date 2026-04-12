import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import clsx from 'clsx';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ButtonWithIcon, Container, VerificationStatusPill } from '@components';
import { colors } from '@common/colors';
import { AuthBrandHeader } from '@src/features/auth/presentation/components/AuthBrandHeader';

export const OnboardingIntroScreen = () => {
  const router = useRouter();

  return (
    <Container
      safeArea
      safeAreaEdges={['top']}
      className={clsx('flex-1 bg-bg-default')}
    >
      <View className="flex-1 self-stretch">
        <View className="flex-1 justify-between self-stretch">
          <View className="gap-8 self-stretch pt-10">
            <View className="items-center">
              <AuthBrandHeader />
            </View>

            <View className="items-center gap-6 self-stretch">
              <View className="items-center self-stretch px-2">
                <VerificationStatusPill
                  label="ID verified / No criminal records"
                  size="sm"
                />
              </View>

              <Text className="text-center font-poppins-semiBold text-800 text-text-default">
                Stand out in the crowd!
              </Text>

              <Text className="font-lexend-regular text-center text-xl text-text-default">
                It’s proven that people with visible trust signals receive more
                engagement.
              </Text>
            </View>
          </View>

          <SafeAreaView edges={['bottom']} className="w-full">
            <View className="w-full pb-4">
              <ButtonWithIcon
                label="Get Started"
                size="lg"
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
        </View>
      </View>
    </Container>
  );
};
