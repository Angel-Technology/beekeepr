import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys, type AuthUser } from '@features/auth';
import { accountService } from '../services/accountService';
import type {
  FieldStatus,
  ProfileUser,
  UpdateProfilePatch,
} from '../models/account.types';
import {
  contactFormReducer,
  isValidPhoneNumber,
  normalizeContactValue,
  PHONE_FIELDS,
  phoneToDigits,
  seedFromUser,
  type ContactField,
  type ContactFormValues,
} from './contactFormReducer';

const PHONE_ERROR_MESSAGE = 'Enter a valid 10-digit phone number.';

const CONTACT_FIELDS = [
  'googleVoicePhone',
  'whatsAppPhone',
  'instagramHandle',
  'telegramHandle',
  'snapchatHandle',
  'signalPhone',
] as const satisfies ReadonlyArray<ContactField>;

const INITIAL_FIELD_STATUS: Record<ContactField, FieldStatus> = {
  googleVoicePhone: 'idle',
  whatsAppPhone: 'idle',
  instagramHandle: 'idle',
  telegramHandle: 'idle',
  snapchatHandle: 'idle',
  signalPhone: 'idle',
};

const INITIAL_FIELD_ERROR: Record<ContactField, string | undefined> = {
  googleVoicePhone: undefined,
  whatsAppPhone: undefined,
  instagramHandle: undefined,
  telegramHandle: undefined,
  snapchatHandle: undefined,
  signalPhone: undefined,
};

const normalize = (value: string): string => value.trim();

/**
 * State and side effects for the Contact Information section of the My
 * Profile screen. Mirrors `useProfileForm` so the two flows feel identical:
 *
 * Responsibilities:
 * - Hold local form state via `contactFormReducer` (pure reducer with named
 *   transitions: `seeded`, `fieldChanged`, `saveSucceeded`, `saveFailed`,
 *   `fieldRevertedToBaseline`).
 * - On blur, diff the current value against the saved baseline and fire
 *   `updateProfile` only when changed. Blank values are reverted to
 *   baseline so an accidental focus-then-blur doesn't wipe the stored
 *   value.
 * - Track per-field save status so the UI can render inline indicators.
 * - On success, merge the returned user back into the cached session so
 *   nickname/handle and the new contact fields stay in lockstep across the
 *   app.
 *
 * Backend strips a leading `@` from Instagram / Telegram handles; we mirror
 * the same rule client-side via `normalizeContactValue` so the stored
 * baseline never carries the prefix.
 */
export const useContactForm = (user: AuthUser | null) => {
  const queryClient = useQueryClient();

  const [state, dispatch] = useReducer(
    contactFormReducer,
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
    useState<Record<ContactField, FieldStatus>>(INITIAL_FIELD_STATUS);
  const [fieldError, setFieldError] =
    useState<Record<ContactField, string | undefined>>(INITIAL_FIELD_ERROR);

  const setStatus = useCallback((field: ContactField, status: FieldStatus) => {
    setFieldStatus((previous) => ({ ...previous, [field]: status }));
  }, []);

  const setError = useCallback(
    (field: ContactField, message: string | undefined) => {
      setFieldError((previous) => ({ ...previous, [field]: message }));
    },
    [],
  );

  // Stable ref to the latest reducer state — blur fires after the last
  // keystroke and we don't want a stale closure reading the previous value.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // React's recommended "reset child state when a prop changes" pattern —
  // derive during render to avoid an extra commit on user identity flip.
  const userKey = user?.id ?? null;
  if (userKey !== state.seedUserId) {
    dispatch({ type: 'seeded', userId: userKey, seed: seedFromUser(user) });
    const anyDirty = CONTACT_FIELDS.some(
      (field) => fieldStatus[field] !== 'idle',
    );
    if (anyDirty) {
      setFieldStatus(INITIAL_FIELD_STATUS);
      setFieldError(INITIAL_FIELD_ERROR);
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
                googleVoicePhone:
                  updated.googleVoicePhone ?? previous.googleVoicePhone,
                whatsAppPhone: updated.whatsAppPhone ?? previous.whatsAppPhone,
                instagramHandle:
                  updated.instagramHandle ?? previous.instagramHandle,
                telegramHandle:
                  updated.telegramHandle ?? previous.telegramHandle,
                snapchatHandle:
                  updated.snapchatHandle ?? previous.snapchatHandle,
                signalPhone: updated.signalPhone ?? previous.signalPhone,
              }
            : previous,
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
    (field: ContactField, value: string) => {
      dispatch({ type: 'fieldChanged', field, value });
      // Editing clears any prior success/error icon and any inline error
      // copy so neither lingers while the user is mid-keystroke.
      setStatus(field, 'idle');
      setError(field, undefined);
    },
    [setError, setStatus],
  );

  const submitField = useCallback(
    (field: ContactField) => {
      const latest = stateRef.current;
      const currentValue = normalize(latest.values[field]);
      const baselineValue = normalize(latest.baseline[field]);

      // Unchanged — nothing to send. (Catches both "both empty" and
      // "both equal" without a separate empty-check branch.)
      if (currentValue === baselineValue) {
        return;
      }

      // Phone fields validate to 10 digits when present. An empty value is
      // legal — it's how the user clears a previously-saved number — so we
      // only validate when there's content to validate.
      if (
        PHONE_FIELDS.has(field) &&
        currentValue.length > 0 &&
        !isValidPhoneNumber(currentValue)
      ) {
        setError(field, PHONE_ERROR_MESSAGE);
        setStatus(field, 'error');
        return;
      }

      // Clearing is a real operation now — send the empty string so the
      // backend wipes the stored value. The previous "revert on blank"
      // shortcut is gone.
      const wireValue = PHONE_FIELDS.has(field)
        ? phoneToDigits(currentValue)
        : normalizeContactValue(field, currentValue);

      setStatus(field, 'saving');
      updateMutation.mutate({ [field]: wireValue } as UpdateProfilePatch, {
        onSuccess: () => {
          setStatus(field, 'success');
          setError(field, undefined);
        },
        onError: () => setStatus(field, 'error'),
      });
    },
    [setError, setStatus, updateMutation],
  );

  const deriveStatus = (field: ContactField): FieldStatus => {
    const explicit = fieldStatus[field];
    if (explicit !== 'idle') {
      return explicit;
    }
    const current = normalize(state.values[field]);
    const baseline = normalize(state.baseline[field]);
    if (current.length > 0 && current === baseline) {
      return 'success';
    }
    return 'idle';
  };

  const derivedFieldStatus = CONTACT_FIELDS.reduce<
    Record<ContactField, FieldStatus>
  >(
    (acc, field) => {
      acc[field] = deriveStatus(field);
      return acc;
    },
    { ...INITIAL_FIELD_STATUS },
  );

  return {
    values: state.values,
    setField,
    submitField,
    fieldStatus: derivedFieldStatus,
    fieldError,
  } as const;
};

export type { ContactField, ContactFormValues };
