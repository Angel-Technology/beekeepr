import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signInWithGoogle,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.session(), user);
    },
  });
};
