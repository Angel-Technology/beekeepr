import { googleAuth } from '@src/lib/auth/google';
import { tokenStorage } from '@src/lib/auth/tokenStorage';
import { authRepository } from '../repository/authRepository';
import type {
  AuthCredentials,
  EmailVerificationRequestInput,
  PersonaInquiryStartResult,
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

  async verifyEmailSignIn(
    input: VerifyEmailCodeInput,
  ): Promise<AuthCredentials> {
    const payload = await authRepository.verifyEmailSignIn(input);

    if (payload.verifyEmailSignIn.error) {
      throw new Error(payload.verifyEmailSignIn.error);
    }

    if (!payload.verifyEmailSignIn.session) {
      throw new Error('Verification succeeded but no session was returned.');
    }

    if (!payload.verifyEmailSignIn.user) {
      throw new Error('Verification succeeded but no user was returned.');
    }

    await tokenStorage.setToken(payload.verifyEmailSignIn.session.token);

    return {
      session: payload.verifyEmailSignIn.session,
      user: payload.verifyEmailSignIn.user,
    };
  },

  async signInWithGoogle(): Promise<AuthCredentials> {
    const idToken = await googleAuth.getIdToken();
    const payload = await authRepository.signInWithGoogle({
      idToken,
    });

    if (payload.signInWithGoogle.error) {
      throw new Error(payload.signInWithGoogle.error);
    }

    if (!payload.signInWithGoogle.session) {
      throw new Error('Google sign-in succeeded but no session was returned.');
    }

    if (!payload.signInWithGoogle.user) {
      throw new Error('Google sign-in succeeded but no user was returned.');
    }

    await tokenStorage.setToken(payload.signInWithGoogle.session.token);

    return {
      session: payload.signInWithGoogle.session,
      user: payload.signInWithGoogle.user,
    };
  },

  async signOut() {
    const payload = await authRepository.signOut();

    if (!payload.signOut.success) {
      throw new Error('Unable to sign out.');
    }

    await tokenStorage.clearToken();
    await googleAuth.signOut();

    return payload.signOut.success;
  },

  async startPersonaInquiry(): Promise<PersonaInquiryStartResult> {
    const payload = await authRepository.startPersonaInquiry();

    if (!payload.startPersonaInquiry.success) {
      throw new Error(
        payload.startPersonaInquiry.error ??
          'Unable to start identity verification.',
      );
    }

    if (!payload.startPersonaInquiry.inquiryId) {
      throw new Error(
        'Verification started but no Persona inquiry ID was returned.',
      );
    }

    return payload.startPersonaInquiry;
  },

  async getCurrentUser() {
    const payload = await authRepository.getCurrentUser();

    return payload.currentUser ?? null;
  },
};
