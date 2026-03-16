import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Container, FloatingLabelInput } from '@components';
import { AuthBrandHeader } from '../components/AuthBrandHeader';

export const CreateAccountEmailScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const trimmedEmail = email.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const canSubmit = trimmedEmail.length > 0 && isValidEmail;

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="gap-8 self-stretch bg-bg-default p-0"
    >
      <AuthBrandHeader />

      <View className="flex flex-col items-start gap-7 self-stretch">
        <View className=" w-full gap-2">
          <Text className="font-poppins-semiBold text-700 text-text-default">
            Enter your Email Address
          </Text>
          <Text className="font-sourceSans-regular text-base text-text-secondary">
            We will send you a{' '}
            <Text className="font-sourceSans-semiBold text-text-default">
              One Time Verification Code
            </Text>{' '}
            via this email address.
          </Text>
        </View>

        <View className="border-border-secondary flex flex-col items-start gap-6 self-stretch rounded-5 border p-lg">
          <FloatingLabelInput
            id="create-account-email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            isValid={!shouldValidate || email.length === 0 || isValidEmail}
            errorText="Please enter a valid email address."
            onBlur={() => setShouldValidate(true)}
            onSubmitEditing={() => setShouldValidate(true)}
          />
        </View>
      </View>

      <View className="mt-auto w-full flex-row gap-3 pb-4">
        <View className="flex-1">
          <Button
            label="Go Back"
            variant="outline"
            className="self-stretch"
            textClassName="text-text-secondary"
            onPress={() => router.back()}
          />
        </View>
        <View className="flex-1">
          <Button
            label="Send"
            className="self-stretch"
            disabled={!canSubmit}
            onPress={() => {
              setShouldValidate(true);

              if (!canSubmit) {
                return;
              }

              router.push({
                pathname: '/auth/create-account-code',
                params: { email: trimmedEmail },
              });
            }}
          />
        </View>
      </View>
    </Container>
  );
};
