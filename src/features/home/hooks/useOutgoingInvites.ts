import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

export const useOutgoingInvites = () => {
  return useQuery({
    queryKey: homeQueryKeys.outgoingInvites(),
    queryFn: () => homeService.listOutgoingInvites(),
  });
};
