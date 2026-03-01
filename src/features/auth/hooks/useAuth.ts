import { useState } from 'react';
import type { AuthResult, AuthStatus } from '../models/auth.types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

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
    status,
    error,
    isLoading: status === 'loading',
    signInWithGoogle: () => runAuthAction(authService.signInWithGoogle),
    startEmailSignUp: () => runAuthAction(authService.startEmailSignUp),
    signOut: () => runAuthAction(authService.signOut),
  };
};
