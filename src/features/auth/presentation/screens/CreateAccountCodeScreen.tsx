import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button, Container } from '@components';
import { AuthBrandHeader } from '../components/AuthBrandHeader';

const CODE_LENGTH = 5;

export const CreateAccountCodeScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [digits, setDigits] = useState(
    Array.from({ length: CODE_LENGTH }, () => ''),
  );
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleDigitChange = (value: string, index: number) => {
    const nextValue = value.replace(/\D/g, '').slice(-1);

    setDigits((currentDigits) => {
      const nextDigits = [...currentDigits];
      nextDigits[index] = nextValue;
      return nextDigits;
    });

    if (nextValue && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = digits.every((digit) => digit.length === 1);
  const formattedEmail =
    typeof email === 'string' && email.length > 0
      ? email
      : 'trashboat@gmail.com';

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
              {formattedEmail}
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
              className="border-border-secondary h-[50px] w-[50px] rounded-3 border text-center font-sourceSans-regular text-base text-text-default"
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
      </View>

      <View className="mt-auto w-full flex-row gap-3">
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
            label="Submit"
            className="self-stretch"
            disabled={!isComplete}
            onPress={() => {}}
          />
        </View>
      </View>
    </Container>
  );
};
