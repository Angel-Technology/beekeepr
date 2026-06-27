import { useQuery } from '@tanstack/react-query';
import { authQueryKeys } from '../models/authQueryKeys';
import { authService } from '../services/authService';

export const useAuthSession = () => {
  return useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: () => authService.getCurrentUser(),
    // Foreground-refetch so the badge crest / profile state stays
    // fresh after the user backgrounded for a while (e.g. checkr
    // status flipped from `NONE` → `APPROVED` in between).
    refetchOnWindowFocus: true,
  });
};
