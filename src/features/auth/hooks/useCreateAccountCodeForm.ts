import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { authValidationService } from '../services/authValidationService';
import { useAuthActions } from './useAuthActions';

const CODE_LENGTH = 5;

export const useCreateAccountCodeForm = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [digits, setDigits] = useState(
    authValidationService.createEmptyCodeDigits(CODE_LENGTH),
  );
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { requestEmailSignIn, verifyEmailSignIn } = useAuthActions();

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
  const handleSubmit = async () => {
    if (!normalizedEmail || !isComplete) {
      return;
    }

    try {
      await verifyEmailSignIn.mutateAsync({
        email: normalizedEmail,
        code: authValidationService.joinVerificationCode(digits),
      });
    } catch {
      return;
    }
  };

  const handleResend = async () => {
    if (!normalizedEmail || requestEmailSignIn.isPending) {
      return;
    }

    try {
      await requestEmailSignIn.mutateAsync({
        email: normalizedEmail,
      });

      setDigits(authValidationService.createEmptyCodeDigits(CODE_LENGTH));
      inputRefs.current[0]?.focus();
      Alert.alert(
        'Verification Code Sent',
        `We sent a new code to ${normalizedEmail}.`,
      );
    } catch (error) {
      Alert.alert(
        'Unable to Resend Code',
        error instanceof Error
          ? error.message
          : 'Please try requesting a new code again.',
      );
    }
  };

  return {
    email: normalizedEmail,
    digits,
    inputRefs,
    isComplete,
    isPending: verifyEmailSignIn.isPending,
    isResending: requestEmailSignIn.isPending,
    handleDigitChange,
    handleKeyPress,
    handleSubmit,
    handleResend,
    handleGoBack: () => router.back(),
  };
};
