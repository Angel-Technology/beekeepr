import { useRouter } from 'expo-router';
import { View } from 'react-native';

import GoogleIcon from '@assets/svg/GoogleIcon';
import IllustrationLetsdothis from '@assets/svg/IllustrationLetsdothis';
import { Button, Container, VerticalSpacer } from '@components';
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

      <View className="flex-1 items-center justify-end self-stretch">
        <IllustrationLetsdothis width={345} height={295} />
      </View>
      <VerticalSpacer size="2xl" />

      <View className="w-full gap-4 pb-4">
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
