import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys, useAuthSession, type AuthUser } from '@features/auth';
import { accountService } from '../services/accountService';
import type { ProfileUser, UpdateProfilePatch } from '../models/account.types';
import { useCheckHandleAvailability } from './useCheckHandleAvailability';
import { stripHandlePrefix } from './profileFormReducer';

type UseCompleteProfileOptions = {
  /**
   * Fired after a successful save. Caller typically dismisses the modal.
   * Save also flips `isProfileIncomplete` on the next render which would
   * dismiss the modal anyway, but explicit beats implicit for UX.
   */
  onSaved?: () => void;
};

type FormState = {
  nickname: string;
  handle: string;
  seedUserId: string | null;
};

const seedFromUser = (user: AuthUser | null | undefined): FormState => ({
  nickname: user?.nickname ?? user?.displayName ?? '',
  handle: stripHandlePrefix(user?.handle ?? ''),
  seedUserId: user?.id ?? null,
});

/**
 * Single-submit form state for the "Create a profile to start" modal.
 *
 * Differs from `useProfileForm` (per-blur auto-save on My Profile) — the
 * modal flow batches both fields into one round-trip on Save tap, with
 * button-level loading state.
 *
 * Seeds from the cached auth user so partially-filled values are
 * preserved when the modal opens, and reseeds during render when the
 * underlying user identity changes (per React's "reset state from props"
 * pattern, no useEffect required).
 */
export const useCompleteProfile = ({
  onSaved,
}: UseCompleteProfileOptions = {}) => {
  const queryClient = useQueryClient();
  const { data: user } = useAuthSession();

  const [state, setState] = useState<FormState>(() => seedFromUser(user));

  const userKey = user?.id ?? null;
  if (userKey !== state.seedUserId) {
    setState(seedFromUser(user));
  }

  const setNickname = (next: string) => {
    setState((prev) => ({ ...prev, nickname: next }));
  };

  const setHandle = (next: string) => {
    setState((prev) => ({ ...prev, handle: stripHandlePrefix(next) }));
  };

  const mergeIntoSession = (updated: ProfileUser) => {
    queryClient.setQueryData<AuthUser | null>(
      authQueryKeys.session(),
      (previous) =>
        previous
          ? {
              ...previous,
              displayName: updated.displayName ?? previous.displayName,
              nickname: updated.nickname ?? previous.nickname,
              handle: updated.handle ?? previous.handle,
              imageUrl: updated.imageUrl ?? previous.imageUrl,
            }
          : previous,
    );
  };

  const mutation = useMutation({
    mutationFn: (input: UpdateProfilePatch) =>
      accountService.updateProfile(input),
    onSuccess: (updated) => {
      mergeIntoSession(updated);
      onSaved?.();
    },
  });

  const trimmedNickname = state.nickname.trim();
  const trimmedHandle = stripHandlePrefix(state.handle);

  // Live backend uniqueness/format check on the handle. Save is gated on
  // its 'success' verdict so a confirmed-available handle is the only
  // way to enable the button.
  const { status: handleStatus, reason: handleReason } =
    useCheckHandleAvailability(state.handle);

  const nicknameStatus =
    trimmedNickname.length > 0 ? ('success' as const) : ('idle' as const);

  const isValid =
    trimmedNickname.length > 0 &&
    trimmedHandle.length > 0 &&
    handleStatus === 'success';

  const save = () => {
    if (!isValid || mutation.isPending) {
      return;
    }
    mutation.mutate({
      nickname: trimmedNickname,
      handle: trimmedHandle,
    });
  };

  return {
    nickname: state.nickname,
    handle: state.handle,
    setNickname,
    setHandle,
    isValid,
    isSaving: mutation.isPending,
    save,
    nicknameStatus,
    handleStatus,
    handleReason,
  };
};
