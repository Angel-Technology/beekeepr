import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const requestEmailSignIn = useMutation({
    mutationFn: authService.requestEmailSignIn,
    onError: (error) => {
      Alert.alert('Sign-In Failed', error.message);
    },
  });

  const verifyEmailSignIn = useMutation({
    mutationFn: authService.verifyEmailSignIn,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      Alert.alert('Verification Failed', error.message);
    },
  });

  const signInWithGoogle = useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
    onError: (error) => {
      Alert.alert('Google Sign-In Failed', error.message);
    },
  });

  const signOut = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session(), null);
    },
  });

  return {
    requestEmailSignIn,
    verifyEmailSignIn,
    signInWithGoogle,
    signOut,
  };
};
