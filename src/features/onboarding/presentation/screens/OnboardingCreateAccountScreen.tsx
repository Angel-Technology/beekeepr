import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
import { Image } from 'expo-image';

import { appImages } from '@assets/images';
import { themedColors, useThemedColor } from '@common';
import AppleIcon from '@assets/svg/AppleIcon';
import GoogleIcon from '@assets/svg/GoogleIcon';
import { BrandMark, Button, Container, VerticalSpacer } from '@components';
import { useAuthActions } from '@features/auth';

export const OnboardingCreateAccountScreen = () => {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuthActions();
  const appleIconColor = useThemedColor(themedColors.text.primary);

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-tk-bg-primary flex-1"
    >
      <VerticalSpacer size="lg" />
      <BrandMark />

      <View className="w-full flex-1 items-center justify-end self-stretch">
        <Image
          source={appImages.illustrationLetsdothis}
          contentFit="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View className="w-full gap-4 pb-4">
        {Platform.OS === 'ios' ? (
          <Button
            label="Continue with Apple"
            variant="outline"
            iconLeft={<AppleIcon color={appleIconColor} />}
            loading={signInWithApple.isPending}
            onPress={() => {
              signInWithApple.mutate();
            }}
          />
        ) : null}
        <Button
          label="Continue with Google"
          variant="outline"
          iconLeft={<GoogleIcon />}
          loading={signInWithGoogle.isPending}
          onPress={() => {
            signInWithGoogle.mutate();
          }}
        />
        <Button
          label="Continue with Email"
          onPress={() => router.push('/auth/create-account-email')}
        />
      </View>
    </Container>
  );
};
