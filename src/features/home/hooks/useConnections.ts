import { useQuery } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

export const useConnections = () => {
  return useQuery({
    queryKey: homeQueryKeys.connections(),
    queryFn: () => homeService.listConnections(),
    // App-foreground refetch — cheapest "fresh on re-entry" without a
    // realtime subscription. The global default is `false`; we opt in
    // per-hook so we don't ship background refetches across the whole
    // app.
    refetchOnWindowFocus: true,
  });
};
