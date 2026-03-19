import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import GoogleIcon from '@assets/svg/GoogleIcon';
import { Button, Container } from '@components';
import { useAuthActions } from '@features/auth';

export const OnboardingCreateAccountScreen = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuthActions();

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className={'bg-bg-default pt-lg'}
    >
      <View className="gap-3 self-stretch">
        <Text className="font-poppins-semiBold text-800 text-text-default">
          Create an account to get started
        </Text>
      </View>

      {/* content for login if Jen changes it */}
      <View className="flex-1 self-stretch" />

      <View className="flex w-full flex-col items-start gap-5 self-stretch">
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
