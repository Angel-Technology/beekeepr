import { environmentConfig } from '../config/environment';

export type AuthConfig = {
  baseURL: string;
  scheme: string;
};

export const authConfig: AuthConfig = {
  baseURL: environmentConfig.authBaseURL,
  scheme: environmentConfig.authScheme,
};

export const isAuthBackendConfigured = authConfig.baseURL.length > 0;
