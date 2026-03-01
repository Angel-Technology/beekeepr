export type AuthConfig = {
  baseURL: string;
  scheme: string;
};

const DEFAULT_SCHEME = 'beekeepr';

export const authConfig: AuthConfig = {
  baseURL: process.env.EXPO_PUBLIC_AUTH_BASE_URL ?? '',
  scheme: process.env.EXPO_PUBLIC_AUTH_SCHEME ?? DEFAULT_SCHEME,
};

export const isAuthBackendConfigured = authConfig.baseURL.length > 0;
