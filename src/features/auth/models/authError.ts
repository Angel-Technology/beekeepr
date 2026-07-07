/**
 * Tagged auth failure kinds.
 *
 * - `kind` lets callers branch on the cause when the UI benefits from it
 *   (e.g. enabling a "Resend code" CTA only on `expired-verification-code`).
 * - When you only need the user-facing string, read `Error.message` — the
 *   constructor mirrors `userMessage` to the standard `Error.message` field
 *   so generic helpers (`useErrorModal().showFromError`, anything that
 *   reads `error.message`) surface friendly copy without knowing the tag.
 */
export type AuthErrorKind =
  | 'invalid-verification-code'
  | 'expired-verification-code'
  | 'rate-limited'
  | 'network'
  | 'unknown';

type AuthErrorPayload = {
  readonly kind: AuthErrorKind;
  /** Friendly, end-user-facing copy. Mirrored to `Error.message`. */
  readonly userMessage: string;
  /**
   * Original backend / network error string — kept for logs and Sentry,
   * intentionally never shown to the user.
   */
  readonly rawMessage?: string;
};

export type AuthError = Error & AuthErrorPayload;

/**
 * Construct a tagged auth error. The friendly `userMessage` is written to
 * `Error.message` so any helper that reads `.message` (the error modal, the
 * inline `serverError` on the email screen, future Sentry breadcrumbs) shows
 * the user-facing copy automatically.
 *
 * Built with `Object.assign` so the readonly payload fields can be set in
 * one expression — there's no separate mutation step the rest of the file
 * has to know about.
 */
export const authError = (payload: AuthErrorPayload): AuthError =>
  Object.assign(new Error(payload.userMessage), {
    name: 'AuthError',
    kind: payload.kind,
    userMessage: payload.userMessage,
    rawMessage: payload.rawMessage,
  });

/**
 * Narrow an `unknown` caught value to `AuthError`. Uses `in` + `typeof` so
 * we never lie about the shape with a cast — the predicate genuinely
 * verifies each discriminating field.
 */
export const isAuthError = (value: unknown): value is AuthError => {
  if (!(value instanceof Error)) {
    return false;
  }
  if (!('kind' in value) || typeof value.kind !== 'string') {
    return false;
  }
  if (!('userMessage' in value) || typeof value.userMessage !== 'string') {
    return false;
  }
  return true;
};
