import { Platform } from 'react-native';

export type AppEnvironment = 'local' | 'staging' | 'production';

const DEFAULT_AUTH_SCHEME = 'beekeepr';
const ANDROID_EMULATOR_HOST = '10.0.2.2';

export type EnvironmentConfig = {
  appEnv: AppEnvironment;
  authBaseURL: string;
  authScheme: string;
  graphQLBaseURL: string;
  googleIosClientId: string;
  googleWebClientId: string;
  revenueCatAndroidApiKey: string;
  revenueCatEntitlementId: string;
  revenueCatIosApiKey: string;
  privacyPolicyURL: string;
  personaEnvironment: 'sandbox' | 'production';
  personaTemplateId: string;
  termsOfUseURL: string;
};

const rawAppEnv = process.env.EXPO_PUBLIC_APP_ENV;

const appEnv =
  rawAppEnv === 'staging' || rawAppEnv === 'production' ? rawAppEnv : 'local';

const mapAndroidLoopbackURL = (value: string) => {
  if (Platform.OS !== 'android' || appEnv !== 'local' || value.length === 0) {
    return value;
  }

  try {
    const nextURL = new URL(value);

    if (nextURL.hostname === '127.0.0.1' || nextURL.hostname === 'localhost') {
      nextURL.hostname = ANDROID_EMULATOR_HOST;
      return nextURL.toString();
    }

    return value;
  } catch {
    return value;
  }
};

export const environmentConfig: EnvironmentConfig = {
  appEnv,
  authBaseURL: mapAndroidLoopbackURL(
    process.env.EXPO_PUBLIC_AUTH_BASE_URL ?? '',
  ),
  authScheme: process.env.EXPO_PUBLIC_AUTH_SCHEME ?? DEFAULT_AUTH_SCHEME,
  graphQLBaseURL: mapAndroidLoopbackURL(
    process.env.EXPO_PUBLIC_GRAPHQL_URL ?? '',
  ),
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  revenueCatAndroidApiKey:
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '',
  revenueCatEntitlementId:
    process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'Buzzkeepr Test Pro',
  revenueCatIosApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '',
  privacyPolicyURL: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '',
  personaEnvironment:
    process.env.EXPO_PUBLIC_PERSONA_ENVIRONMENT === 'production'
      ? 'production'
      : 'sandbox',
  personaTemplateId: process.env.EXPO_PUBLIC_PERSONA_TEMPLATE_ID ?? '',
  termsOfUseURL: process.env.EXPO_PUBLIC_TERMS_OF_USE_URL ?? '',
};
