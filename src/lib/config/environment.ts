export type AppEnvironment = 'local' | 'staging' | 'production';

const DEFAULT_AUTH_SCHEME = 'beekeepr';

export type EnvironmentConfig = {
  appEnv: AppEnvironment;
  authBaseURL: string;
  authScheme: string;
  graphQLBaseURL: string;
  googleIosClientId: string;
  googleWebClientId: string;
  personaEnvironment: 'sandbox' | 'production';
  personaTemplateId: string;
};

const rawAppEnv = process.env.EXPO_PUBLIC_APP_ENV;

const appEnv =
  rawAppEnv === 'staging' || rawAppEnv === 'production' ? rawAppEnv : 'local';

export const environmentConfig: EnvironmentConfig = {
  appEnv,
  authBaseURL: process.env.EXPO_PUBLIC_AUTH_BASE_URL ?? '',
  authScheme: process.env.EXPO_PUBLIC_AUTH_SCHEME ?? DEFAULT_AUTH_SCHEME,
  graphQLBaseURL: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  personaEnvironment:
    process.env.EXPO_PUBLIC_PERSONA_ENVIRONMENT === 'production'
      ? 'production'
      : 'sandbox',
  personaTemplateId: process.env.EXPO_PUBLIC_PERSONA_TEMPLATE_ID ?? '',
};
