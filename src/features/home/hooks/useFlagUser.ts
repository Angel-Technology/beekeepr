import { useMutation } from '@tanstack/react-query';
import { homeService } from '../services/homeService';

/**
 * Flags `targetUserId` for moderation. No query invalidation — flagging
 * doesn't change any of the list-query payloads the home tab reads.
 * `flagPendingId` lets the caller render a spinner on the action row.
 */
export const useFlagUser = () => {
  const flag = useMutation({
    mutationFn: (targetUserId: string) => homeService.flagUser(targetUserId),
  });

  return {
    flag: flag.mutate,
    flagPendingId: flag.isPending && flag.variables ? flag.variables : null,
  };
};
