export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
  requestEmailCode: () => [...authQueryKeys.all, 'request-email-code'] as const,
  verifyEmailCode: () => [...authQueryKeys.all, 'verify-email-code'] as const,
  signInWithGoogle: () =>
    [...authQueryKeys.all, 'sign-in-with-google'] as const,
};
