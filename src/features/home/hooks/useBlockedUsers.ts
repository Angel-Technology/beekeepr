import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

export const useBlockedUsers = () => {
  return useQuery({
    queryKey: homeQueryKeys.blockedUsers(),
    queryFn: () => homeService.listBlockedUsers(),
    refetchOnWindowFocus: true,
  });
};
