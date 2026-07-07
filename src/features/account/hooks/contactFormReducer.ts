import type { AuthUser } from '@features/auth';
import type { ProfileUser } from '../models/account.types';
import { stripHandlePrefix } from './profileFormReducer';

/**
 * Backend-aligned field names — using the GraphQL input shape directly so
 * `submitField(field)` can pass `{ [field]: value }` straight into the
 * `UpdateProfileInput` patch without translation. Keep this in sync with
 * `UpdateProfileInput` in the generated types.
 */
export type ContactField =
  | 'googleVoicePhone'
  | 'whatsAppPhone'
  | 'instagramHandle'
  | 'telegramHandle'
  | 'snapchatHandle'
  | 'signalPhone';

export type ContactFormValues = Readonly<Record<ContactField, string>>;

/**
 * Phone-style contact fields. Same NANP-style formatting + validation as
 * the checkr criminal-background form (`useCriminalCheckForm`). Stored in
 * canonical formatted form `(XXX) XXX-XXXX` so the input always reads
 * well-formed; we strip back to digits-only on submit to the backend.
 *
 * Signal is intentionally NOT in this set — the schema field is named
 * `signalPhone` but the Figma renders it as a `https://signal.me/#eu/...`
 * profile link, so it stays a free-text field.
 */
export const PHONE_FIELDS = new Set<ContactField>([
  'googleVoicePhone',
  'whatsAppPhone',
]);

const PHONE_DIGIT_LIMIT = 10;

/**
 * Strip to digits, drop a leading `1` country code if present, cap at 10
 * digits, and reformat as `(XXX) XXX-XXXX`. Mirrors the helper in
 * `useCriminalCheckForm` so the two phone-collecting flows agree on the
 * input shape.
 */
export const formatPhoneForDisplay = (raw: string): string => {
  const allDigits = raw.replace(/\D/g, '');
  const trimmed =
    allDigits.length === 11 && allDigits.startsWith('1')
      ? allDigits.slice(1)
      : allDigits;
  const digits = trimmed.slice(0, PHONE_DIGIT_LIMIT);

  if (digits.length === 0) {
    return '';
  }
  if (digits.length <= 3) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/** Backend stores digits-only — we format for display + strip on submit. */
export const phoneToDigits = (formatted: string): string =>
  formatted.replace(/\D/g, '');

export const isValidPhoneNumber = (formatted: string): boolean =>
  phoneToDigits(formatted).length === PHONE_DIGIT_LIMIT;

export type ContactFormState = {
  readonly values: ContactFormValues;
  readonly baseline: ContactFormValues;
  readonly seedUserId: string | null;
};

export type ContactFormAction =
  | { type: 'seeded'; userId: string | null; seed: ContactFormValues }
  | { type: 'fieldChanged'; field: ContactField; value: string }
  | { type: 'saveSucceeded'; updated: ProfileUser }
  | { type: 'saveFailed' }
  | { type: 'fieldRevertedToBaseline'; field: ContactField };

/**
 * Instagram, Telegram, and Snapchat store canonical handles without a
 * leading `@` — matches `stripHandlePrefix` from `profileFormReducer` so
 * the two flows agree on the rule.
 */
const HANDLE_FIELDS = new Set<ContactField>([
  'instagramHandle',
  'telegramHandle',
  'snapchatHandle',
]);

/**
 * Per-field normalization applied on every keystroke (`fieldChanged`) and
 * at seed time. Phone fields run through the NANP formatter so the input
 * always renders well-formed; handle fields strip the leading `@` so the
 * stored value stays canonical.
 */
export const normalizeContactValue = (
  field: ContactField,
  value: string,
): string => {
  if (PHONE_FIELDS.has(field)) {
    return formatPhoneForDisplay(value);
  }
  if (HANDLE_FIELDS.has(field)) {
    return stripHandlePrefix(value);
  }
  return value;
};

export const seedFromUser = (user: AuthUser | null): ContactFormValues => ({
  googleVoicePhone: formatPhoneForDisplay(user?.googleVoicePhone ?? ''),
  whatsAppPhone: formatPhoneForDisplay(user?.whatsAppPhone ?? ''),
  instagramHandle: stripHandlePrefix(user?.instagramHandle ?? ''),
  telegramHandle: stripHandlePrefix(user?.telegramHandle ?? ''),
  snapchatHandle: stripHandlePrefix(user?.snapchatHandle ?? ''),
  signalPhone: user?.signalPhone ?? '',
});

/**
 * Pure reducer for the contact-info section of the Profile screen.
 *
 * Variants mirror `profileFormReducer` so the two flows feel identical
 * to read:
 * - `seeded` — replace `values` and `baseline` from a fresh server seed
 *   and remember which `userId` produced it.
 * - `fieldChanged` — write a single field into `values`. Instagram and
 *   Telegram strip the leading `@` so the stored value stays canonical.
 * - `saveSucceeded` — promote the server response into `baseline` so
 *   subsequent blurs diff against the new ground truth.
 * - `saveFailed` — roll the entire `values` back to `baseline` so the
 *   UI matches what's actually saved.
 * - `fieldRevertedToBaseline` — roll a single field back. Used when the
 *   user blurs after blanking a field — accidental blanking shouldn't
 *   wipe the stored value.
 */
export const contactFormReducer = (
  state: ContactFormState,
  action: ContactFormAction,
): ContactFormState => {
  switch (action.type) {
    case 'seeded':
      return {
        values: action.seed,
        baseline: action.seed,
        seedUserId: action.userId,
      };
    case 'fieldChanged': {
      const next = normalizeContactValue(action.field, action.value);
      return {
        ...state,
        values: { ...state.values, [action.field]: next },
      };
    }
    case 'saveSucceeded': {
      const baseline: ContactFormValues = {
        googleVoicePhone:
          action.updated.googleVoicePhone ?? state.baseline.googleVoicePhone,
        whatsAppPhone:
          action.updated.whatsAppPhone ?? state.baseline.whatsAppPhone,
        instagramHandle: stripHandlePrefix(
          action.updated.instagramHandle ?? state.baseline.instagramHandle,
        ),
        telegramHandle: stripHandlePrefix(
          action.updated.telegramHandle ?? state.baseline.telegramHandle,
        ),
        snapchatHandle: stripHandlePrefix(
          action.updated.snapchatHandle ?? state.baseline.snapchatHandle,
        ),
        signalPhone: action.updated.signalPhone ?? state.baseline.signalPhone,
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
