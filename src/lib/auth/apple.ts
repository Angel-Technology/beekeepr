import * as AppleAuthentication from 'expo-apple-authentication';

export class AppleSignInCancelledError extends Error {
  constructor() {
    super('Apple sign-in was cancelled.');
    this.name = 'AppleSignInCancelledError';
  }
}

export const isAppleSignInCancelled = (error: unknown): boolean =>
  error instanceof AppleSignInCancelledError;

// Apple's `ERR_REQUEST_CANCELED` is what `signInAsync` throws when the user
// dismisses the system sheet. The constant isn't exported from the package,
// so we match on the code string.
const APPLE_CANCELLED_CODE = 'ERR_REQUEST_CANCELED';

const isCancelledError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'code' in error && error.code === APPLE_CANCELLED_CODE;
};

// Apple only returns the user's full name on the very first authorization for
// a given Apple ID + app. Every subsequent sign-in returns `fullName: null`,
// and per the backend contract we forward `null` so the server keeps the
// previously-stored displayName intact.
const buildDisplayName = (
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
): string | null => {
  if (!fullName) {
    return null;
  }
  const parts = [fullName.givenName, fullName.familyName].filter(
    (part): part is string => typeof part === 'string' && part.length > 0,
  );
  if (parts.length === 0) {
    return null;
  }
  return parts.join(' ');
};

export const appleAuth = {
  isAvailable() {
    return AppleAuthentication.isAvailableAsync();
  },

  async signIn(): Promise<{ identityToken: string; displayName: string | null }> {
    let credential: AppleAuthentication.AppleAuthenticationCredential;
    try {
      credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
    } catch (error) {
      if (isCancelledError(error)) {
        throw new AppleSignInCancelledError();
      }
      throw error;
    }

    if (!credential.identityToken) {
      throw new Error('Apple sign-in did not return an identity token.');
    }

    return {
      identityToken: credential.identityToken,
      displayName: buildDisplayName(credential.fullName),
    };
  },
};
