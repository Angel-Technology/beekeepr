import { useQuery } from '@tanstack/react-query';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: () => authService.getCurrentUser(),
  });
};
