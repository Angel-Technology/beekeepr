import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { authValidationService } from '../services/authValidationService';
import { useVerifyEmailSignIn } from './useVerifyEmailSignIn';

const CODE_LENGTH = 5;

export const useCreateAccountCodeForm = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [digits, setDigits] = useState(
    authValidationService.createEmptyCodeDigits(CODE_LENGTH),
  );
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const verifyEmailSignIn = useVerifyEmailSignIn();

  const normalizedEmail = typeof email === 'string' ? email.trim() : '';

  useEffect(() => {
    if (!normalizedEmail) {
      router.replace('/auth/create-account-email');
    }
  }, [normalizedEmail, router]);

  const handleDigitChange = (value: string, index: number) => {
    const nextValue = authValidationService.sanitizeVerificationDigit(value);

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

  const isComplete = authValidationService.isVerificationCodeComplete(digits);
  const serverError =
    verifyEmailSignIn.error instanceof Error
      ? verifyEmailSignIn.error.message
      : null;

  const handleSubmit = async () => {
    if (!normalizedEmail || !isComplete) {
      return;
    }

    await verifyEmailSignIn.mutateAsync({
      email: normalizedEmail,
      code: authValidationService.joinVerificationCode(digits),
    });
  };

  return {
    email: normalizedEmail,
    digits,
    inputRefs,
    isComplete,
    isPending: verifyEmailSignIn.isPending,
    serverError,
    handleDigitChange,
    handleKeyPress,
    handleSubmit,
    handleGoBack: () => router.back(),
  };
};
