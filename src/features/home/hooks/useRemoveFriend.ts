import { useMutation, useQueryClient } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Removes the friendship with `otherUserId`. Invalidates the connections
 * list on success so the row drops out. `removePendingId` lets the
 * caller render a spinner on the originating row.
 */
export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: (otherUserId: string) => homeService.removeFriend(otherUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.connections(),
      });
    },
  });

  return {
    remove: remove.mutate,
    removePendingId:
      remove.isPending && remove.variables ? remove.variables : null,
  };
};
