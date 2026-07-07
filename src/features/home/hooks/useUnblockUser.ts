import { useMutation, useQueryClient } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Unblock handler. Invalidates the `blockedUsers` list on success so the
 * row drops out. `unblockPendingId` lets the row render a spinner on the
 * specific button the user pressed without blocking other rows.
 */
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  const unblock = useMutation({
    mutationFn: (targetUserId: string) => homeService.unblockUser(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.blockedUsers(),
      });
    },
  });

  return {
    unblock: unblock.mutate,
    unblockPendingId:
      unblock.isPending && unblock.variables ? unblock.variables : null,
  };
};
