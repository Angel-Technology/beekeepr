import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authQueryKeys.all,
      });
    },
  });
};
