import { authRepository } from '../repository/authRepository';

export const authService = {
  signInWithGoogle: () => authRepository.signInWithGoogle(),
  startEmailSignUp: () => authRepository.startEmailSignUp(),
  getSession: () => authRepository.getSession(),
  signOut: () => authRepository.signOut(),
};
