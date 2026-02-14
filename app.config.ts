import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * ============================================
 * Variant Types
 * ============================================
 */

export type AppVariant = 'dev' | 'test' | 'prod';

/**
 * Resolves current app variant safely.
 */
export const getAppVariant = (): AppVariant => {
  const variant = (process.env.EXPO_PUBLIC_APP_VARIANT ?? 'dev') as AppVariant;

  switch (variant) {
    case 'dev':
    case 'test':
    case 'prod':
      return variant;
    default:
      if (variant) {
        console.warn(
          `Invalid EXPO_PUBLIC_APP_VARIANT "${variant}". Expected "dev", "test", or "prod". Defaulting to "dev".`,
        );
      }
      return 'dev';
  }
};

/**
 * ============================================
 * Environment Config Types
 * ============================================
 */

export type EnvironmentConfig = {
  name: string;
  slug: string;
  scheme: string;
  icon: string;
  bundleIdentifier: string;
  androidPackage: string;
};

export type DeployConfig = {
  environments: Record<AppVariant, EnvironmentConfig>;
};

/**
 * ============================================
 * Single Source of Truth
 * ============================================
 */

export const DEPLOY_CONFIG: DeployConfig = {
  environments: {
    dev: {
      name: 'Beekeepr Dev',
      slug: 'beekeepr',
      scheme: 'beekeepr-dev',
      icon: './src/assets/images/icon-dev.png',
      bundleIdentifier: 'com.beekeepr.app.dev',
      androidPackage: 'com.beekeepr.app.dev',
    },
    test: {
      name: 'Beekeepr Test',
      slug: 'beekeepr',
      scheme: 'beekeepr-test',
      icon: './src/assets/images/icon-test.png',
      bundleIdentifier: 'com.beekeepr.app.test',
      androidPackage: 'com.beekeepr.app.test',
    },
    prod: {
      name: 'Beekeepr',
      slug: 'beekeepr',
      scheme: 'beekeepr',
      icon: './src/assets/images/icon.png',
      bundleIdentifier: 'com.beekeepr.app',
      androidPackage: 'com.beekeepr.app',
    },
  },
};

/**
 * ============================================
 * Helpers
 * ============================================
 */

export const getEnvironmentConfig = (variant: AppVariant): EnvironmentConfig =>
  DEPLOY_CONFIG.environments[variant];

export const getCurrentEnvironmentConfig = (): EnvironmentConfig => {
  const variant = getAppVariant();
  return getEnvironmentConfig(variant);
};

/**
 * ============================================
 * Expo Config Export
 * ============================================
 */

export default ({ config }: ConfigContext): ExpoConfig => {
  const variant = getAppVariant();
  const env = getEnvironmentConfig(variant);

  return {
    ...config,

    name: env.name,
    slug: env.slug,
    version: config.version ?? '0.0.1',
    orientation: 'portrait',
    scheme: env.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: env.bundleIdentifier,
      buildNumber: config.ios?.buildNumber ?? '1',
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleDisplayName: env.name,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [env.scheme],
          },
        ],
      },
    },

    android: {
      ...config.android,
      package: env.androidPackage,
      versionCode: config.android?.versionCode ?? 1,
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },

    icon: env.icon,

    extra: {
      appVariant: variant,
    },
  };
};
