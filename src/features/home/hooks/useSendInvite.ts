import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchQueryKeys } from '@features/search/models/searchQueryKeys';
import { homeQueryKeys } from '../models/homeQueryKeys';
import { homeService } from '../services/homeService';

/**
 * Send-friend-request mutation wired for the search drawer. Invalidates
 * the `outgoingInvites` list (so the new pending invite shows up on the
 * Buzz tab) and any open search-results query (so the tapped row's
 * `viewerFriendshipState` flips from NONE → REQUEST_SENT and the
 * trailing button swaps Invite for Unsend). Exposes `sendPendingId` so
 * the drawer's Invite button can spinner without blocking other actions.
 */
export const useSendInvite = () => {
  const queryClient = useQueryClient();

  const send = useMutation({
    mutationFn: (targetUserId: string) => homeService.sendInvite(targetUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.outgoingInvites(),
      });
      void queryClient.invalidateQueries({
        queryKey: searchQueryKeys.usersRoot(),
      });
    },
  });

  return {
    send: send.mutate,
    sendPendingId: send.isPending && send.variables ? send.variables : null,
  };
};
