import { useState } from 'react';
import { authClient, isAuthClientConfigured } from '@src/lib/auth/client';
import { authQueryKeys } from '../models/authQueryKeys';
import type { AuthResult, AuthSession, AuthStatus } from '../models/auth.types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const sessionQuery = authClient.useSession();
  const [status, setStatus] = useState<AuthStatus>(
    isAuthClientConfigured ? 'loading' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);

  const session =
    sessionQuery.data?.session?.id && sessionQuery.data.user?.id
      ? ({
          id: sessionQuery.data.session.id,
          expiresAt:
            typeof sessionQuery.data.session.expiresAt === 'string'
              ? sessionQuery.data.session.expiresAt
              : sessionQuery.data.session.expiresAt?.toISOString(),
          user: {
            id: sessionQuery.data.user.id,
            email: sessionQuery.data.user.email,
            name: sessionQuery.data.user.name ?? undefined,
          },
        } satisfies AuthSession)
      : null;

  const runAuthAction = async (
    action: () => Promise<AuthResult>,
  ): Promise<AuthResult> => {
    setStatus('loading');
    setError(null);

    const result = await action();

    if (result.success) {
      setStatus(result.session ? 'authenticated' : 'unauthenticated');
      return result;
    }

    setStatus('unauthenticated');
    setError(result.error);
    return result;
  };

  return {
    queryKeys: authQueryKeys,
    session,
    status:
      status === 'loading' ||
      sessionQuery.isPending ||
      sessionQuery.isRefetching
        ? 'loading'
        : session
          ? 'authenticated'
          : status,
    error,
    isLoading:
      status === 'loading' ||
      sessionQuery.isPending ||
      sessionQuery.isRefetching,
    signInWithGoogle: () => runAuthAction(authService.signInWithGoogle),
    startEmailSignUp: (email: string) =>
      runAuthAction(() => authService.startEmailSignUp(email)),
    signOut: () => runAuthAction(authService.signOut),
  };
};
