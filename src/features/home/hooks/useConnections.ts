import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

export const useConnections = () => {
  return useQuery({
    queryKey: homeQueryKeys.connections(),
    queryFn: () => homeService.listConnections(),
  });
};
