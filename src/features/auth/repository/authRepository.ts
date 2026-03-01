import { authClient, isAuthClientConfigured } from '@src/lib/auth/client';
import type { AuthResult } from '../models/auth.types';

export type AuthRepository = {
  signInWithGoogle: () => Promise<AuthResult>;
  startEmailSignUp: (email: string) => Promise<AuthResult>;
  getSession: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const notConfiguredResult = (): AuthResult => {
  return {
    success: false,
    error: 'Auth backend is not configured yet.',
  };
};

const mapSessionResult = (data: unknown): AuthResult => {
  if (
    !data ||
    typeof data !== 'object' ||
    !('user' in data) ||
    !('session' in data)
  ) {
    return {
      success: true,
    };
  }

  const { session, user } = data as {
    session?: {
      id?: string;
      expiresAt?: Date | string;
    };
    user?: {
      id?: string;
      email?: string;
      name?: string | null;
    };
  };

  if (!session?.id || !user?.id || !user.email) {
    return {
      success: true,
    };
  }

  return {
    success: true,
    session: {
      id: session.id,
      expiresAt:
        typeof session.expiresAt === 'string'
          ? session.expiresAt
          : session.expiresAt?.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
      },
    },
  };
};

export const authRepository: AuthRepository = {
  async signInWithGoogle() {
    if (!isAuthClientConfigured) {
      return notConfiguredResult();
    }

    try {
      const signInResult = await authClient.signIn.social({
        provider: 'google',
      });

      if (signInResult.error) {
        return {
          success: false,
          error:
            signInResult.error.message ?? 'Google sign-in could not start.',
        };
      }

      const sessionResult = await authClient.getSession();

      if (sessionResult.error) {
        return {
          success: false,
          error:
            sessionResult.error.message ??
            'Google sign-in completed, but the session could not be loaded.',
        };
      }

      return mapSessionResult(sessionResult.data);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Google sign-in failed unexpectedly.',
      };
    }
  },

  async startEmailSignUp(_email) {
    return {
      success: false,
      error: 'Email sign-up flow is not implemented yet.',
    };
  },

  async getSession() {
    if (!isAuthClientConfigured) {
      return notConfiguredResult();
    }

    try {
      const sessionResult = await authClient.getSession();

      if (sessionResult.error) {
        return {
          success: false,
          error: sessionResult.error.message ?? 'Session lookup failed.',
        };
      }

      return mapSessionResult(sessionResult.data);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Session lookup failed unexpectedly.',
      };
    }
  },

  async signOut() {
    if (!isAuthClientConfigured) {
      return notConfiguredResult();
    }

    try {
      const signOutResult = await authClient.signOut();

      if (signOutResult.error) {
        return {
          success: false,
          error: signOutResult.error.message ?? 'Sign-out failed.',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Sign-out failed unexpectedly.',
      };
    }
  },
};
