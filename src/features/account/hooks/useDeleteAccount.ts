import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '@features/auth';
import { useGlobalLoader } from '@src/lib/loader';
import { useErrorModal } from '@src/lib/error-modal';
import { accountService } from '../services/accountService';

const GLOBAL_LOADER_KEY = 'account.delete.request';

/**
 * State and side effects for the Delete Account confirmation screen.
 *
 * Responsibilities:
 * - Fire the `requestAccountDeletion` mutation when the user confirms.
 * - Raise the global bounce loader while the request is in flight and
 *   surface failures through the global error modal.
 * - On success, sign the user out so the cached session clears and the
 *   route guards bounce the user back to the onboarding/auth surface.
 *
 * Why: the post-success step is `signOut`, not a manual `router.replace`,
 * because clearing the cached session is what drives the auth-aware
 * navigation layout — keeping that single source of truth avoids a
 * flashed-screen race between cache clear and route push.
 */
export const useDeleteAccount = () => {
  const loader = useGlobalLoader();
  const errorModal = useErrorModal();
  const { signOut } = useAuthActions();

  const requestDeletion = useMutation({
    mutationFn: accountService.requestAccountDeletion,
    onMutate: () => loader.show(GLOBAL_LOADER_KEY),
    onSettled: () => loader.hide(GLOBAL_LOADER_KEY),
    onSuccess: () => {
      signOut.mutate();
    },
    onError: (error) => {
      errorModal.showFromError(error, 'Account Deletion Failed');
    },
  });

  const confirmDelete = useCallback(() => {
    if (requestDeletion.isPending) {
      return;
    }
    requestDeletion.mutate();
  }, [requestDeletion]);

  return {
    confirmDelete,
    isDeleting: requestDeletion.isPending,
  } as const;
};
