import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import GoogleIcon from '@assets/svg/GoogleIcon';
import JoinBeeIllustration from '@assets/svg/JoinBeeIllustration';
import { Button, ButtonWithIcon, Container } from '@components';
import { useAuthActions } from '@features/auth';
import { AuthBrandHeader } from '@src/features/auth/presentation/components/AuthBrandHeader';

export const OnboardingCreateAccountScreen = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuthActions();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="flex-1 bg-bg-default"
    >
      <AuthBrandHeader />
      <View className="flex flex-col items-center gap-7 self-stretch pb-5">
        <View className="items-center justify-center self-stretch">
          <JoinBeeIllustration width={345} height={366} />
        </View>

        <View className="items-center gap-2 self-stretch">
          <Text className="text-center font-poppins-semiBold text-2xl text-text-default">
            Create an account to get started.
          </Text>
        </View>
      </View>

      <View className="mt-auto w-full gap-5 pb-4">
        <ButtonWithIcon
          label="Continue with Google"
          variant="outline"
          className="self-stretch"
          size="lg"
          iconLeft={<GoogleIcon />}
          loading={signInWithGoogle.isPending}
          onPress={() => {
            signInWithGoogle.mutate();
          }}
        />
        <Button
          label="Continue with Email"
          size="lg"
          className="self-stretch"
          onPress={() => router.push('/auth/create-account-email')}
        />
      </View>
    </Container>
  );
};
