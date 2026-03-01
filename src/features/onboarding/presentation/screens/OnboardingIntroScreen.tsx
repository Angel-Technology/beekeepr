import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import clsx from 'clsx';
import { Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appImages } from '@assets/images';
import Logo from '@assets/svg/Logo';
import { Button, Container } from '@components';
import { colors } from '@common/colors';

export const OnboardingIntroScreen = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isCompactDevice = height < 750;

  return (
    <Container
      safeArea
      safeAreaEdges={['top']}
      className={clsx(
        'flex-1 items-center bg-bg-default',
        isCompactDevice ? 'gap-6 pt-6' : 'gap-8 pt-[72px]',
      )}
    >
      <Logo width={276.942} height={59} />
      <View className="w-full items-start gap-lg self-stretch">
        <Text className="font-poppins-semiBold text-600 text-text-default">
          It’s a total buzz kill to search for identities and criminal history!
        </Text>
        <Text className="font-sourceSans-regular text-400 text-text-default">
          You’re not alone. 75% of women and 55% of men report safety as a major
          concern when meeting someone new.
        </Text>
        <Text className="font-sourceSans-regular text-400 text-text-default">
          Let us handle the “bs” of verifying identities and running criminal
          background checks for you — we take the awkwardness out of the entire
          process.
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Image
          source={appImages.awkwardBee}
          contentFit="contain"
          style={{ width: 260, height: 230 }}
        />
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
