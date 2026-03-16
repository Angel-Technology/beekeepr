import { authRepository } from '../repository/authRepository';
import type {
  AuthSession,
  EmailVerificationRequestInput,
  GoogleSignInInput,
  VerifyEmailCodeInput,
} from '../models/auth.types';

export const authService = {
  async requestEmailSignIn(input: EmailVerificationRequestInput) {
    const payload = await authRepository.requestEmailSignIn(input);

    if (!payload.requestEmailSignIn.success) {
      throw new Error(
        payload.requestEmailSignIn.error ?? 'Unable to send verification code.',
      );
    }

    return payload.requestEmailSignIn;
  },

  async verifyEmailSignIn(input: VerifyEmailCodeInput): Promise<AuthSession> {
    const payload = await authRepository.verifyEmailSignIn(input);

    if (payload.verifyEmailSignIn.error) {
      throw new Error(payload.verifyEmailSignIn.error);
    }

    if (!payload.verifyEmailSignIn.user) {
      throw new Error('Verification succeeded but no user was returned.');
    }

    return payload.verifyEmailSignIn.user;
  },

  async signInWithGoogle(input: GoogleSignInInput): Promise<AuthSession> {
    const payload = await authRepository.signInWithGoogle(input);

    if (payload.signInWithGoogle.error) {
      throw new Error(payload.signInWithGoogle.error);
    }

    if (!payload.signInWithGoogle.user) {
      throw new Error('Google sign-in succeeded but no user was returned.');
    }

    return payload.signInWithGoogle.user;
  },

  async signOut() {
    const payload = await authRepository.signOut();

    if (!payload.signOut.success) {
      throw new Error('Unable to sign out.');
    }

    return payload.signOut.success;
  },

  async getCurrentUser() {
    const payload = await authRepository.getCurrentUser();

    return payload.currentUser ?? null;
  },
};
