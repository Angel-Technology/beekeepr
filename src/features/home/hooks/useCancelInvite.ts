import { useMutation, useQueryClient } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Unsend handler for an invite the user previously sent. Invalidates the
 * `outgoingInvites` list on success so the row drops out. Exposes
 * `cancelPendingId` so a row can render a spinner on the specific button
 * the user pressed without blocking other rows.
 */
export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  const cancel = useMutation({
    mutationFn: (otherUserId: string) => homeService.cancelInvite(otherUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.outgoingInvites(),
      });
    },
  });

  return {
    cancel: cancel.mutate,
    cancelPendingId:
      cancel.isPending && cancel.variables ? cancel.variables : null,
  };
};
