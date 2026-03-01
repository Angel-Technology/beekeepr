import { authClient } from '@src/lib/auth/client';
import type { AuthResult } from '../models/auth.types';

export type AuthRepository = {
  signInWithGoogle: () => Promise<AuthResult>;
  startEmailSignUp: () => Promise<AuthResult>;
  getSession: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const notConfiguredResult = (): AuthResult => {
  return {
    success: false,
    error: 'Auth backend is not configured yet.',
  };
};

export const authRepository: AuthRepository = {
  async signInWithGoogle() {
    if (!authClient.isConfigured) {
      return notConfiguredResult();
    }

    return {
      success: false,
      error:
        'Google sign-in client flow is ready, but the backend is not implemented yet.',
    };
  },

  async startEmailSignUp() {
    if (!authClient.isConfigured) {
      return notConfiguredResult();
    }

    return {
      success: false,
      error:
        'Email sign-up client flow is ready, but the backend is not implemented yet.',
    };
  },

  async getSession() {
    return {
      success: false,
      error: 'No auth session is available yet.',
    };
  },

  async signOut() {
    return {
      success: true,
    };
  },
};
