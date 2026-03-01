export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
  signInWithGoogle: () => [...authQueryKeys.all, 'signInWithGoogle'] as const,
  startEmailSignUp: () => [...authQueryKeys.all, 'startEmailSignUp'] as const,
};
