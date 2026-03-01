import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { authConfig, isAuthBackendConfigured } from './config';

export const authClient = createAuthClient({
  baseURL: authConfig.baseURL,
  plugins: [
    expoClient({
      scheme: authConfig.scheme,
      storagePrefix: authConfig.scheme,
      storage: SecureStore,
    }),
  ],
});

export const isAuthClientConfigured = isAuthBackendConfigured;
