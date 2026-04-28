import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthActions } from './useAuthActions';

const CODE_LENGTH = 5;

export const useCreateAccountCodeForm = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const lastSubmittedCodeRef = useRef<string | null>(null);
  const { requestEmailSignIn, verifyEmailSignIn } = useAuthActions();

  const normalizedEmail = typeof email === 'string' ? email.trim() : '';

  useEffect(() => {
    if (!normalizedEmail) {
      router.replace('/auth/create-account-email');
    }
  }, [normalizedEmail, router]);

  const isComplete = code.length === CODE_LENGTH;

  const handleSubmit = useCallback(async () => {
    if (!normalizedEmail || !isComplete) {
      return;
    }
    if (verifyEmailSignIn.isPending) {
      return;
    }

    try {
      lastSubmittedCodeRef.current = code;
      await verifyEmailSignIn.mutateAsync({
        email: normalizedEmail,
        code,
      });
    } catch {
      return;
    }
  }, [code, isComplete, normalizedEmail, verifyEmailSignIn]);

  useEffect(() => {
    if (!isComplete || !normalizedEmail || verifyEmailSignIn.isPending) {
      return;
    }

    if (lastSubmittedCodeRef.current === code) {
      return;
    }

    void handleSubmit();
  }, [
    code,
    handleSubmit,
    isComplete,
    normalizedEmail,
    verifyEmailSignIn.isPending,
  ]);

  const handleResend = async () => {
    if (!normalizedEmail || requestEmailSignIn.isPending) {
      return;
    }

    try {
      await requestEmailSignIn.mutateAsync({
        email: normalizedEmail,
      });

      setCode('');
      lastSubmittedCodeRef.current = null;
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
    code,
    setCode,
    codeLength: CODE_LENGTH,
    isComplete,
    isPending: verifyEmailSignIn.isPending,
    isResending: requestEmailSignIn.isPending,
    handleSubmit,
    handleResend,
    handleGoBack: () => router.back(),
  };
};
