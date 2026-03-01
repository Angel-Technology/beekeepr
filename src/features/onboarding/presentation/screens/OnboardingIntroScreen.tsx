import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { appImages } from '@assets/images';
import Logo from '@assets/svg/Logo';
import { Container } from '@components';

export function OnboardingIntroScreen() {
  return (
    <Container className="items-center gap-8 bg-bg-default pb-7 pt-[127px]">
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
        style={{ width: 207, height: 183 }}
      />
    </Container>
  );
}
