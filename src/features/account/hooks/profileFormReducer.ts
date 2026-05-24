import type { AuthUser } from '@features/auth';
import type { ProfileUser } from '../models/account.types';

export type ProfileField = 'nickname' | 'handle';

export type ProfileFormValues = Record<ProfileField, string>;

export type ProfileFormState = {
  values: ProfileFormValues;
  baseline: ProfileFormValues;
  seedUserId: string | null;
};

export type ProfileFormAction =
  | { type: 'seeded'; userId: string | null; seed: ProfileFormValues }
  | { type: 'fieldChanged'; field: ProfileField; value: string }
  | { type: 'saveSucceeded'; updated: ProfileUser }
  | { type: 'saveFailed' }
  | { type: 'fieldRevertedToBaseline'; field: ProfileField };

const HANDLE_PREFIX = '@';

/**
 * Enforce the leading `@` invariant on whatever the user typed. Collapses
 * accidental `@@…`, re-adds the prefix if they erased it, and tolerates a
 * bare value coming back from the server.
 */
export const formatHandleForDisplay = (
  raw: string | null | undefined,
): string => {
  const value = (raw ?? '').trim();
  if (value.length === 0) {
    return HANDLE_PREFIX;
  }
  const withoutPrefix = value.replace(/^@+/, '');
  return `${HANDLE_PREFIX}${withoutPrefix}`;
};

export const stripHandlePrefix = (value: string): string =>
  value.replace(/^@+/, '').trim();

export const seedFromUser = (user: AuthUser | null): ProfileFormValues => ({
  nickname: user?.nickname ?? user?.displayName ?? '',
  handle: formatHandleForDisplay(user?.handle),
});

/**
 * Pure reducer for the My Profile form.
 *
 * Variants:
 * - `seeded`: replace both `values` and `baseline` from a server-supplied
 *   seed and remember which `userId` produced it.
 * - `fieldChanged`: write a single field into `values` (handle field also
 *   re-applies the `@` invariant).
 * - `saveSucceeded`: promote the server response into `baseline` so future
 *   blurs diff against the new ground truth.
 * - `saveFailed`: roll the entire `values` back to `baseline` so the UI
 *   matches what's actually saved.
 * - `fieldRevertedToBaseline`: roll a single field back (used when the
 *   user blurs after blanking a field — we don't want a blur to clear the
 *   stored value).
 */
export const profileFormReducer = (
  state: ProfileFormState,
  action: ProfileFormAction,
): ProfileFormState => {
  switch (action.type) {
    case 'seeded':
      return {
        values: action.seed,
        baseline: action.seed,
        seedUserId: action.userId,
      };
    case 'fieldChanged': {
      const next =
        action.field === 'handle'
          ? formatHandleForDisplay(action.value)
          : action.value;
      return {
        ...state,
        values: { ...state.values, [action.field]: next },
      };
    }
    case 'saveSucceeded': {
      const baseline: ProfileFormValues = {
        nickname:
          action.updated.nickname ??
          action.updated.displayName ??
          state.baseline.nickname,
        handle: formatHandleForDisplay(
          action.updated.handle ?? state.baseline.handle,
        ),
      };
      return { ...state, baseline };
    }
    case 'saveFailed':
      return { ...state, values: state.baseline };
    case 'fieldRevertedToBaseline':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: state.baseline[action.field],
        },
      };
  }
};
