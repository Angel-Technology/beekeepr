import { authRepository } from '../repository/authRepository';

export const authService = {
  signInWithGoogle: () => authRepository.signInWithGoogle(),
  startEmailSignUp: (email: string) => authRepository.startEmailSignUp(email),
  getSession: () => authRepository.getSession(),
  signOut: () => authRepository.signOut(),
};
