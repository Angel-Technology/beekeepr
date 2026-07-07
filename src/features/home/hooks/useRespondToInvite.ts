import { useMutation, useQueryClient } from '@tanstack/react-query';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Accept / decline handlers for pending invites.
 *
 * Both responses invalidate the `incomingInvites` query so the row drops
 * out of the list. Accepting additionally invalidates `connections` so
 * the new friend lands on that list on the next paint.
 *
 * Per-action pending ids let the row render a spinner on the *specific*
 * button the user pressed without blocking the other one or other rows.
 */
export const useRespondToInvite = () => {
  const queryClient = useQueryClient();

  const accept = useMutation({
    mutationFn: (otherUserId: string) => homeService.acceptInvite(otherUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.incomingInvites(),
      });
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.connections(),
      });
    },
  });

  const decline = useMutation({
    mutationFn: (otherUserId: string) => homeService.declineInvite(otherUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.incomingInvites(),
      });
    },
  });

  return {
    accept: accept.mutate,
    decline: decline.mutate,
    acceptPendingId:
      accept.isPending && accept.variables ? accept.variables : null,
    declinePendingId:
      decline.isPending && decline.variables ? decline.variables : null,
  };
};
