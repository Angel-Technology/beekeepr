import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { authValidationService } from '../services/authValidationService';
import { useRequestEmailSignIn } from './useRequestEmailSignIn';

export const useCreateAccountEmailForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);
  const requestEmailSignIn = useRequestEmailSignIn();

  const trimmedEmail = useMemo(() => {
    return authValidationService.normalizeEmail(email);
  }, [email]);

  const isValidEmail = useMemo(() => {
    return authValidationService.isValidEmail(trimmedEmail);
  }, [trimmedEmail]);

  const canSubmit = trimmedEmail.length > 0 && isValidEmail;
  const shouldShowEmailError =
    shouldValidate && email.length > 0 && !isValidEmail;
  const serverError =
    requestEmailSignIn.error instanceof Error
      ? requestEmailSignIn.error.message
      : null;

  const validate = () => {
    setShouldValidate(true);
  };

  const handleSend = async () => {
    validate();

    if (!canSubmit) {
      return;
    }

    await requestEmailSignIn.mutateAsync({
      email: trimmedEmail,
    });

    router.push({
      pathname: '/auth/create-account-code',
      params: { email: trimmedEmail },
    });
  };

  return {
    email,
    setEmail,
    canSubmit,
    isPending: requestEmailSignIn.isPending,
    shouldShowEmailError,
    serverError,
    validate,
    handleSend,
    handleGoBack: () => router.back(),
  };
};
