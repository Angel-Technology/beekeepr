import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { appImages } from '@assets/images';
import GoogleIcon from '@assets/svg/GoogleIcon';
import JoinBeeIllustration from '@assets/svg/JoinBeeIllustration';
import { Button, Container } from '@components';
import { useAuthActions } from '@features/auth';

export const OnboardingCreateAccountScreen = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuthActions();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="flex-1 bg-bg-default"
    >
      <View className="flex-1 items-center justify-center gap-7 self-stretch py-sm">
        <View className="flex flex-col items-center gap-7 self-stretch p-5">
          <View className="flex flex-row items-start justify-center gap-1 self-stretch">
            <Text className="text-center font-poppins-semiBold text-800 text-text-default">
              Join TheBuzz
            </Text>
            <Image
              source={appImages.betaLogo}
              contentFit="contain"
              style={{ width: 32, height: 14 }}
            />
          </View>

          <View className="items-center justify-center self-stretch">
            <JoinBeeIllustration width={345} height={366} />
          </View>

          <View className="items-center gap-2 self-stretch">
            <Text className="text-center font-poppins-semiBold text-800 text-text-default">
              Create an account to get started.
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-auto w-full gap-5 pb-4">
        <Button
          label="Continue with Google"
          variant="outline"
          className="self-stretch"
          iconLeft={<GoogleIcon />}
          loading={signInWithGoogle.isPending}
          onPress={() => {
            signInWithGoogle.mutate();
          }}
        />
        <Button
          label="Continue with Email"
          className="self-stretch"
          onPress={() => router.push('/auth/create-account-email')}
        />
      </View>
    </Container>
  );
};
