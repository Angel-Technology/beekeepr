import { useMutation, useQueryClient } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Blocks `targetUserId`. The backend removes any friendship that
 * existed AND adds the user to the blocked list, so we invalidate
 * connections + blockedUsers on success. `blockPendingId` lets the
 * caller render a spinner on the originating row.
 */
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const block = useMutation({
    mutationFn: (targetUserId: string) => homeService.blockUser(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.blockedUsers(),
      });
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.connections(),
      });
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.incomingInvites(),
      });
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.outgoingInvites(),
      });
    },
  });

  return {
    block: block.mutate,
    blockPendingId: block.isPending && block.variables ? block.variables : null,
  };
};
