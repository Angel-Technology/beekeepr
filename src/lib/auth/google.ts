import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { environmentConfig } from '../config/environment';

const googleWebClientId = environmentConfig.googleWebClientId;
const googleIosClientId = environmentConfig.googleIosClientId;

let isConfigured = false;

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled.');
    this.name = 'GoogleSignInCancelledError';
  }
}

export const isGoogleSignInCancelled = (error: unknown): boolean =>
  error instanceof GoogleSignInCancelledError;

export const googleAuth = {
  configure() {
    if (isConfigured) {
      return;
    }

    if (!googleWebClientId) {
      throw new Error('Google web client ID is not configured.');
    }

    if (!googleIosClientId) {
      throw new Error('Google iOS client ID is not configured.');
    }

    GoogleSignin.configure({
      webClientId: googleWebClientId,
      iosClientId: googleIosClientId,
    });

    isConfigured = true;
  },

  async getIdToken() {
    this.configure();

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const response = await GoogleSignin.signIn();

    if (response.type !== 'success') {
      throw new GoogleSignInCancelledError();
    }

    if (!response.data.idToken) {
      throw new Error('Google sign-in did not return an ID token.');
    }

    return response.data.idToken;
  },

  async signOut() {
    this.configure();
    await GoogleSignin.signOut();
  },
};
