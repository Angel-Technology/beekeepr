import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Button, Container } from '@components';
import { useCreateAccountCodeForm } from '@features/auth';
import { AuthBrandHeader } from '../components/AuthBrandHeader';

export const CreateAccountCodeScreen = () => {
  const {
    email,
    digits,
    inputRefs,
    isComplete,
    isPending,
    isResending,
    handleDigitChange,
    handleKeyPress,
    handleSubmit,
    handleResend,
    handleGoBack,
  } = useCreateAccountCodeForm();

  if (!email) {
    return null;
  }

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      keyboardAvoiding
      className="gap-8 self-stretch bg-bg-default p-0"
    >
      <AuthBrandHeader />

      <View className="flex flex-col items-start gap-7 self-stretch">
        <View className="w-full gap-2">
          <Text className="font-poppins-semiBold text-700 text-text-default">
            Enter your Verification Code
          </Text>
          <Text className="font-sourceSans-regular text-base text-text-secondary">
            We sent a verification code to your email{' '}
            <Text className="font-sourceSans-semiBold text-text-default">
              {email}
            </Text>
            .
          </Text>
        </View>

        <View className="flex w-full flex-row justify-center gap-4 self-stretch">
          {digits.map((digit, index) => (
            <TextInput
              key={`code-digit-${index}`}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              autoFocus={index === 0}
              className="h-[50px] w-[50px] rounded-3 border border-border-secondary text-center font-sourceSans-regular text-base text-text-default"
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(value) => handleDigitChange(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              selectTextOnFocus
              value={digit}
            />
          ))}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          disabled={isResending}
          onPress={() => {
            void handleResend();
          }}
        >
          <Text className="font-sourceSans-medium text-base text-text-default underline">
            {isResending ? 'Sending...' : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-auto w-full flex-row gap-3">
        <View className="flex-1">
          <Button
            label="Go Back"
            variant="outline"
            className="self-stretch"
            textClassName="text-text-secondary"
            onPress={handleGoBack}
          />
        </View>
        <View className="flex-1">
          <Button
            label="Submit"
            className="self-stretch"
            disabled={!isComplete}
            loading={isPending}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </Container>
  );
};
