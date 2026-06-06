import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAppleSignInCancelled } from '@src/lib/auth/apple';
import { isGoogleSignInCancelled } from '@src/lib/auth/google';
import { useErrorModal } from '@src/lib/error-modal';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const { showFromError } = useErrorModal();

  const requestEmailSignIn = useMutation({
    mutationFn: authService.requestEmailSignIn,
    onError: (error) => {
      showFromError(error, 'Sign-In Failed');
    },
  });

  const verifyEmailSignIn = useMutation({
    mutationFn: authService.verifyEmailSignIn,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      showFromError(error, 'Verification Failed');
    },
  });

  const signInWithGoogle = useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      if (isGoogleSignInCancelled(error)) {
        return;
      }
      showFromError(error, 'Google Sign-In Failed');
    },
  });

  const signInWithApple = useMutation({
    mutationFn: authService.signInWithApple,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      if (isAppleSignInCancelled(error)) {
        return;
      }
      showFromError(error, 'Apple Sign-In Failed');
    },
  });

  const signOut = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session(), null);
    },
  });

  const acceptTerms = useMutation({
    mutationFn: authService.acceptTerms,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      showFromError(error, 'Terms Acceptance Failed');
    },
  });

  return {
    requestEmailSignIn,
    verifyEmailSignIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    acceptTerms,
  };
};
