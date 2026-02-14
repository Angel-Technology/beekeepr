import { ExpoConfig, ConfigContext } from 'expo/config';

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

/**
 * ============================================
 * Beekeepr (Single App Variant)
 * ============================================
 * One bundle id, one app, TestFlight controls access via groups.
 */

const APP: EnvironmentConfig = {
  name: 'Beekeepr',
  slug: 'beekeepr',
  scheme: 'beekeepr',
  icon: './src/assets/images/icon.png',
  bundleIdentifier: 'com.beekeepr.app', // iOS
  androidPackage: 'com.beekeepr.app', // Android
};

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,

    name: APP.name,
    slug: APP.slug,
    version: config.version ?? '0.0.1',
    orientation: 'portrait',
    scheme: APP.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: APP.bundleIdentifier,
      buildNumber: config.ios?.buildNumber ?? '1',
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleDisplayName: APP.name,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [APP.scheme],
          },
        ],
      },
    },

    android: {
      ...config.android,
      package: APP.androidPackage,
      versionCode: config.android?.versionCode ?? 1,
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },

    icon: APP.icon,
  };
};
