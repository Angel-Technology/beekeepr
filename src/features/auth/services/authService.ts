import { appleAuth, isAppleSignInCancelled } from '@src/lib/auth/apple';
import { googleAuth, isGoogleSignInCancelled } from '@src/lib/auth/google';
import { tokenStorage } from '@src/lib/auth/tokenStorage';
import { authRepository } from '../repository/authRepository';
import { authError, isAuthError } from '../models/authError';
import type {
  AuthCredentials,
  EmailVerificationRequestInput,
  VerifyEmailCodeInput,
} from '../models/auth.types';

const NETWORK_USER_MESSAGE =
  "We're having trouble reaching the server. Please check your connection and try again.";

const rawMessageOf = (value: unknown): string =>
  value instanceof Error ? value.message : String(value);

/**
 * Wrap a non-AuthError caught value as a `network` AuthError. AuthErrors are
 * re-thrown as-is so already-classified failures preserve their `kind`.
 */
const wrapUnknownAsNetwork = (e: unknown): never => {
  if (isAuthError(e)) {
    throw e;
  }
  throw authError({
    kind: 'network',
    userMessage: NETWORK_USER_MESSAGE,
    rawMessage: rawMessageOf(e),
  });
};

export const authService = {
  async requestEmailSignIn(input: EmailVerificationRequestInput) {
    try {
      // Upsert the user account before sending the code. The new backend
      // splits sign-up (`createUser`) and verification (`requestEmailSignIn`)
      // into two mutations — for new accounts createUser provisions the
      // user, for returning accounts the backend reports "already exists"
      // which we deliberately ignore: only `requestEmailSignIn` decides
      // whether the code actually goes out. A transport-level failure here
      // (network, server) escalates via the outer catch as a friendly
      // network error.
      await authRepository.createUser({ email: input.email });

      const payload = await authRepository.requestEmailSignIn(input);

      if (!payload.requestEmailSignIn.success) {
        throw authError({
          kind: 'unknown',
          userMessage:
            "We couldn't send your verification code. Please try again.",
          rawMessage: payload.requestEmailSignIn.error ?? undefined,
        });
      }

      return payload.requestEmailSignIn;
    } catch (e) {
      wrapUnknownAsNetwork(e);
    }
  },

  async verifyEmailSignIn(
    input: VerifyEmailCodeInput,
  ): Promise<AuthCredentials> {
    try {
      const payload = await authRepository.verifyEmailSignIn(input);

      if (payload.verifyEmailSignIn.error) {
        throw authError({
          kind: 'invalid-verification-code',
          userMessage:
            "We couldn't verify that code. Please double-check it and try again.",
          rawMessage: payload.verifyEmailSignIn.error,
        });
      }

      if (!payload.verifyEmailSignIn.session) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you in. Please try again.",
          rawMessage: 'Verification succeeded but no session was returned.',
        });
      }

      if (!payload.verifyEmailSignIn.user) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you in. Please try again.",
          rawMessage: 'Verification succeeded but no user was returned.',
        });
      }

      await tokenStorage.setToken(payload.verifyEmailSignIn.session.token);

      return {
        session: payload.verifyEmailSignIn.session,
        user: payload.verifyEmailSignIn.user,
      };
    } catch (e) {
      wrapUnknownAsNetwork(e);
      // wrapUnknownAsNetwork always throws; this satisfies the
      // never-fall-through control flow path.
      throw e;
    }
  },

  async signInWithGoogle(): Promise<AuthCredentials> {
    try {
      const idToken = await googleAuth.getIdToken();
      const payload = await authRepository.signInWithGoogle({
        idToken,
      });

      if (payload.signInWithGoogle.error) {
        throw authError({
          kind: 'unknown',
          userMessage:
            "We couldn't sign you in with Google. Please try again.",
          rawMessage: payload.signInWithGoogle.error,
        });
      }

      if (!payload.signInWithGoogle.session) {
        throw authError({
          kind: 'unknown',
          userMessage:
            "We couldn't sign you in with Google. Please try again.",
          rawMessage: 'Google sign-in succeeded but no session was returned.',
        });
      }

      if (!payload.signInWithGoogle.user) {
        throw authError({
          kind: 'unknown',
          userMessage:
            "We couldn't sign you in with Google. Please try again.",
          rawMessage: 'Google sign-in succeeded but no user was returned.',
        });
      }

      await tokenStorage.setToken(payload.signInWithGoogle.session.token);

      return {
        session: payload.signInWithGoogle.session,
        user: payload.signInWithGoogle.user,
      };
    } catch (e) {
      if (isAuthError(e)) {
        throw e;
      }
      // Preserve user-cancellation so the mutation `onError` can silently
      // swallow it instead of opening the error modal.
      if (isGoogleSignInCancelled(e)) {
        throw e;
      }
      throw authError({
        kind: 'unknown',
        userMessage:
          "We couldn't sign you in with Google. Please try again.",
        rawMessage: rawMessageOf(e),
      });
    }
  },

  async signInWithApple(): Promise<AuthCredentials> {
    try {
      const { identityToken, displayName } = await appleAuth.signIn();
      const payload = await authRepository.signInWithApple({
        idToken: identityToken,
        displayName,
      });

      if (payload.signInWithApple.error) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you in with Apple. Please try again.",
          rawMessage: payload.signInWithApple.error,
        });
      }

      if (!payload.signInWithApple.session) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you in with Apple. Please try again.",
          rawMessage: 'Apple sign-in succeeded but no session was returned.',
        });
      }

      if (!payload.signInWithApple.user) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you in with Apple. Please try again.",
          rawMessage: 'Apple sign-in succeeded but no user was returned.',
        });
      }

      await tokenStorage.setToken(payload.signInWithApple.session.token);

      return {
        session: payload.signInWithApple.session,
        user: payload.signInWithApple.user,
      };
    } catch (e) {
      if (isAuthError(e)) {
        throw e;
      }
      if (isAppleSignInCancelled(e)) {
        throw e;
      }
      throw authError({
        kind: 'unknown',
        userMessage: "We couldn't sign you in with Apple. Please try again.",
        rawMessage: rawMessageOf(e),
      });
    }
  },

  async signOut() {
    try {
      const payload = await authRepository.signOut();

      if (!payload.signOut.success) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't sign you out. Please try again.",
        });
      }

      await tokenStorage.clearToken();
      await googleAuth.signOut();

      return payload.signOut.success;
    } catch (e) {
      wrapUnknownAsNetwork(e);
      throw e;
    }
  },

  async acceptTerms() {
    try {
      const payload = await authRepository.acceptTerms();

      if (payload.acceptTerms.error) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't update your account. Please try again.",
          rawMessage: payload.acceptTerms.error,
        });
      }

      if (!payload.acceptTerms.user) {
        throw authError({
          kind: 'unknown',
          userMessage: "We couldn't update your account. Please try again.",
          rawMessage:
            'Terms acceptance succeeded but no user was returned.',
        });
      }

      return payload.acceptTerms.user;
    } catch (e) {
      wrapUnknownAsNetwork(e);
      throw e;
    }
  },

  async getCurrentUser() {
    const payload = await authRepository.getCurrentUser();

    return payload.currentUser ?? null;
  },
};
