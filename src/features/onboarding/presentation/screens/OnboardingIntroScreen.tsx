import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { appImages } from '@assets/images';
import Logo from '@assets/svg/Logo';
import { Button, Container } from '@components';
import { colors } from '@common/colors';

export function OnboardingIntroScreen() {
  const router = useRouter();

  return (
    <Container className="flex-1 items-center gap-8 bg-bg-default pb-7 pt-[127px]">
      <Logo width={276.942} height={59} />
      <View className="w-full items-start gap-lg self-stretch">
        <Text className="font-poppins-semiBold text-600 leading-[25px] text-text-default">
          It’s a total buzz kill to search for identities and criminal history!
        </Text>
        <Text className="font-sourceSans-regular text-400 leading-[20.8px] tracking-[-0.3px] text-text-default">
          You’re not alone. 75% of women and 55% of men report safety as a major
          concern when meeting someone new.
        </Text>
        <Text className="font-sourceSans-regular text-400 leading-[20.8px] tracking-[-0.3px] text-text-default">
          Let us handle the “bs” of verifying identities and running criminal
          background checks for you — we take the awkwardness out of the entire
          process.
        </Text>
      </View>

      <Image
        source={appImages.awkwardBee}
        contentFit="contain"
        style={{ width: 260, height: 230 }}
      />

      <View className="mt-auto w-full">
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
    </Container>
  );
}
