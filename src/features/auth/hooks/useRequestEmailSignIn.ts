import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useRequestEmailSignIn = () => {
  return useMutation({
    mutationFn: authService.requestEmailSignIn,
  });
};
