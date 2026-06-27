import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authQueryKeys,
  ContactVisibility,
  ProfileVisibility,
  type AuthUser,
} from '@features/auth';
import { accountService } from '../services/accountService';
import type {
  FieldStatus,
  ProfileUser,
  UpdateProfilePatch,
} from '../models/account.types';
import {
  profileFormReducer,
  seedFromUser,
  stripHandlePrefix,
  type ProfileField,
  type ProfileFormValues,
} from './profileFormReducer';

const FIELD_LABEL: Record<ProfileField, string> = {
  nickname: 'Nickname',
  handle: 'Handle',
};

const INITIAL_FIELD_STATUS: Record<ProfileField, FieldStatus> = {
  nickname: 'idle',
  handle: 'idle',
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
 * - Track per-field save status (`idle | saving | success | error`) so the
 *   UI can render an inline spinner / check / X next to each input. This
 *   replaces the global bounce loader + error modal for these field saves.
 * - On success, merge the returned user back into the cached auth session
 *   so the rest of the app sees the new nickname/handle.
 */
export const useProfileForm = (user: AuthUser | null) => {
  const queryClient = useQueryClient();

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

  const [fieldStatus, setFieldStatus] =
    useState<Record<ProfileField, FieldStatus>>(INITIAL_FIELD_STATUS);

  const setStatus = useCallback((field: ProfileField, status: FieldStatus) => {
    setFieldStatus((previous) => ({ ...previous, [field]: status }));
  }, []);

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
    if (fieldStatus.nickname !== 'idle' || fieldStatus.handle !== 'idle') {
      setFieldStatus(INITIAL_FIELD_STATUS);
    }
  }

  const mergeIntoSession = useCallback(
    (updated: ProfileUser) => {
      queryClient.setQueryData<AuthUser | null>(
        authQueryKeys.session(),
        (previous) =>
          previous
            ? {
                ...previous,
                nickname: updated.nickname ?? previous.nickname,
                handle: updated.handle ?? previous.handle,
                imageUrl: updated.imageUrl ?? previous.imageUrl,
                phoneNumber: updated.phoneNumber ?? previous.phoneNumber,
                googleVoicePhone:
                  updated.googleVoicePhone ?? previous.googleVoicePhone,
                whatsAppPhone: updated.whatsAppPhone ?? previous.whatsAppPhone,
                instagramHandle:
                  updated.instagramHandle ?? previous.instagramHandle,
                telegramHandle:
                  updated.telegramHandle ?? previous.telegramHandle,
                signalPhone: updated.signalPhone ?? previous.signalPhone,
                profileVisibility: updated.profileVisibility,
                contactVisibility: updated.contactVisibility,
              }
            : previous,
      );
    },
    [queryClient],
  );

  // Optimistic-patch helper for the visibility toggles: writes the new value
  // straight into the cached session so the switch reflects the change on
  // the next frame, then fires the mutation. `mergeIntoSession` reconciles
  // on success; on error the mutation's onError reverts via the cache.
  const patchSession = useCallback(
    (patch: Partial<AuthUser>) => {
      queryClient.setQueryData<AuthUser | null>(
        authQueryKeys.session(),
        (previous) => (previous ? { ...previous, ...patch } : previous),
      );
    },
    [queryClient],
  );

  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfilePatch) =>
      accountService.updateProfile(input),
    onSuccess: (updated) => {
      mergeIntoSession(updated);
      dispatch({ type: 'saveSucceeded', updated });
    },
    onError: () => {
      dispatch({ type: 'saveFailed' });
    },
  });

  const setField = useCallback(
    (field: ProfileField, value: string) => {
      dispatch({ type: 'fieldChanged', field, value });
      // Editing clears any prior success/error so the icon doesn't linger
      // while the user is mid-keystroke.
      setStatus(field, 'idle');
    },
    [setStatus],
  );

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

      setStatus(field, 'saving');
      updateMutation.mutate({ [field]: currentValue } as UpdateProfilePatch, {
        onSuccess: () => setStatus(field, 'success'),
        onError: () => setStatus(field, 'error'),
      });
    },
    [setStatus, updateMutation],
  );

  /**
   * Source of truth for the Share Profile toggle. The local UI doesn't keep
   * a copy — it reads `profileVisibility` straight off the cached session,
   * which `mergeIntoSession` keeps in sync with the backend.
   */
  const setProfileVisibility = useCallback(
    (next: ProfileVisibility) => {
      if (user?.profileVisibility === next) {
        return;
      }
      patchSession({ profileVisibility: next });
      updateMutation.mutate({ profileVisibility: next });
    },
    [patchSession, updateMutation, user?.profileVisibility],
  );

  /**
   * Source of truth for the contact-sharing switch. The "Share with
   * everyone" / `PUBLIC` rung was dropped — both from the UI and from
   * the backend's `ContactVisibility` enum — so the only writes are:
   *
   *   PRIVATE          → toggle off
   *   CONNECTIONS_ONLY → toggle on
   */
  const setContactVisibility = useCallback(
    (next: ContactVisibility) => {
      if (user?.contactVisibility === next) {
        return;
      }
      patchSession({ contactVisibility: next });
      updateMutation.mutate({ contactVisibility: next });
    },
    [patchSession, updateMutation, user?.contactVisibility],
  );

  /**
   * Persist the user's chosen avatar URL (the DiceBear picker page calls
   * this once the user lands on a character). Optimistic write so the
   * preview card / avatar circle updates immediately while the mutation
   * round-trips. Passing an empty string clears the avatar back to the
   * default UserRound placeholder.
   */
  const setImageUrl = useCallback(
    (next: string) => {
      const normalized = next.trim();
      if ((user?.imageUrl ?? '') === normalized) {
        return;
      }
      patchSession({ imageUrl: normalized.length > 0 ? normalized : null });
      updateMutation.mutate({ imageUrl: normalized });
    },
    [patchSession, updateMutation, user?.imageUrl],
  );

  const deriveStatus = (field: ProfileField): FieldStatus => {
    const explicit = fieldStatus[field];
    if (explicit !== 'idle') {
      return explicit;
    }
    const current = normalize(wireValueForField(field, state.values));
    const baseline = normalize(wireValueForField(field, state.baseline));
    if (current.length > 0 && current === baseline) {
      return 'success';
    }
    return 'idle';
  };

  const derivedFieldStatus: Record<ProfileField, FieldStatus> = {
    nickname: deriveStatus('nickname'),
    handle: deriveStatus('handle'),
  };

  return {
    values: state.values,
    setField,
    submitField,
    fieldLabel: FIELD_LABEL,
    fieldStatus: derivedFieldStatus,
    profileVisibility: user?.profileVisibility ?? ProfileVisibility.Public,
    contactVisibility: user?.contactVisibility ?? ContactVisibility.Private,
    setProfileVisibility,
    setContactVisibility,
    imageUrl: user?.imageUrl ?? null,
    setImageUrl,
  } as const;
};
