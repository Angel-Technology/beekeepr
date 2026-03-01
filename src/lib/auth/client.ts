import { authConfig, isAuthBackendConfigured } from './config';

export type AuthClient = {
  baseURL: string;
  scheme: string;
  isConfigured: boolean;
};

export const createAuthClient = (): AuthClient => {
  return {
    baseURL: authConfig.baseURL,
    scheme: authConfig.scheme,
    isConfigured: isAuthBackendConfigured,
  };
};

export const authClient = createAuthClient();
