import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

export const useIncomingInvites = () => {
  return useQuery({
    queryKey: homeQueryKeys.incomingInvites(),
    queryFn: () => homeService.listIncomingInvites(),
  });
};
