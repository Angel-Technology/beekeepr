import type { AuthUser } from './auth.types';

export const hasAcceptedCurrentTerms = (user: AuthUser | null | undefined) => {
  if (!user) {
    return false;
  }

  return Boolean(user.termsAcceptedAtUtc);
};
