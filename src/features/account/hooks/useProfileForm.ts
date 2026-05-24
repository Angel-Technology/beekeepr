import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys, type AuthUser } from '@features/auth';
import { useGlobalLoader } from '@src/lib/loader';
import { useErrorModal } from '@src/lib/error-modal';
import { accountService } from '../services/accountService';
import type { ProfileUser, UpdateProfilePatch } from '../models/account.types';
import {
  profileFormReducer,
  seedFromUser,
  stripHandlePrefix,
  type ProfileField,
  type ProfileFormValues,
} from './profileFormReducer';

const GLOBAL_LOADER_KEY = 'account.profile.update';

const FIELD_LABEL: Record<ProfileField, string> = {
  nickname: 'Nickname',
  handle: 'Handle',
};

const normalize = (value: string): string => value.trim();

const wireValueForField = (
  field: ProfileField,
  values: ProfileFormValues,
): string =>
  field === 'handle' ? stripHandlePrefix(values.handle) : values[field];

/**
 * State and side effects for the My Profile screen.
 *
 * Responsibilities:
 * - Hold the local form state via `profileFormReducer` — a pure reducer
 *   with named transitions (`seeded`, `fieldChanged`, `saveSucceeded`,
 *   `saveFailed`, `fieldRevertedToBaseline`).
 * - On a field blur, diff the latest value against the saved baseline and
 *   fire an `updateProfile` mutation only when the value changed. Blank
 *   values are treated as "no change" so accidentally clearing a field on
 *   blur doesn't wipe the server value.
 * - Raise the global bounce loader for the duration of each in-flight
 *   call, and surface failures through the global error modal.
 * - On success, merge the returned user back into the cached auth session
 *   so the rest of the app sees the new nickname/handle.
 */
export const useProfileForm = (user: AuthUser | null) => {
  const queryClient = useQueryClient();
  const loader = useGlobalLoader();
  const errorModal = useErrorModal();

  const [state, dispatch] = useReducer(
    profileFormReducer,
    user,
    (initialUser) => {
      const seed = seedFromUser(initialUser);
      return {
        values: seed,
        baseline: seed,
        seedUserId: initialUser?.id ?? null,
      };
    },
  );

  // One ref mirrors the latest reducer state so `submitField` never reads a
  // stale closure when blur fires immediately after a keystroke.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // React's recommended "reset child state when a prop changes" pattern:
  // derive during render rather than scheduling an effect, to avoid the
  // extra commit. https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const userKey = user?.id ?? null;
  if (userKey !== state.seedUserId) {
    dispatch({ type: 'seeded', userId: userKey, seed: seedFromUser(user) });
  }

  const mergeIntoSession = useCallback(
    (updated: ProfileUser) => {
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
    },
    [queryClient],
  );

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfilePatch) =>
      accountService.updateProfile(input),
    onMutate: () => loader.show(GLOBAL_LOADER_KEY),
    onSettled: () => loader.hide(GLOBAL_LOADER_KEY),
    onSuccess: (updated) => {
      mergeIntoSession(updated);
      dispatch({ type: 'saveSucceeded', updated });
    },
    onError: (error) => {
      dispatch({ type: 'saveFailed' });
      errorModal.showFromError(error, 'Update Failed');
    },
  });

  const setField = useCallback((field: ProfileField, value: string) => {
    dispatch({ type: 'fieldChanged', field, value });
  }, []);

  const submitField = useCallback(
    (field: ProfileField) => {
      const latest = stateRef.current;
      const currentValue = normalize(wireValueForField(field, latest.values));
      const baselineValue = normalize(
        wireValueForField(field, latest.baseline),
      );

      if (currentValue === baselineValue) {
        return;
      }

      if (currentValue.length === 0) {
        dispatch({ type: 'fieldRevertedToBaseline', field });
        return;
      }

      updateMutation.mutate({ [field]: currentValue } as UpdateProfilePatch);
    },
    [updateMutation],
  );

  return {
    values: state.values,
    setField,
    submitField,
    fieldLabel: FIELD_LABEL,
    isSaving: updateMutation.isPending,
  } as const;
};
