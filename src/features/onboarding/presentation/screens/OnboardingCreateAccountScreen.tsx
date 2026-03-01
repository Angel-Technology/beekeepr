import { Text, View } from 'react-native';

import GoogleIcon from '@assets/svg/GoogleIcon';
import { useAuth } from '@features';
import { Button, Container } from '@components';

export const OnboardingCreateAccountScreen = () => {
  const { error, isLoading, signInWithGoogle } = useAuth();

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
          disabled={isLoading}
          onPress={() => {
            void signInWithGoogle();
          }}
        />
        <Button
          label="Continue with Email"
          className="self-stretch"
          disabled={isLoading}
          onPress={() => {}}
        />
        {error ? (
          <Text className="font-sourceSans-regular text-300 text-text-secondary">
            {error}
          </Text>
        ) : null}
      </View>
    </Container>
  );
};
