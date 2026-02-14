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
    userInterfaceStyle: 'light',
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
    plugins: [
      [
        'expo-font',
        {
          fonts: [
            './src/assets/fonts/SourceSans3-BlackItalic.ttf',
            './src/assets/fonts/SourceSans3-Black.ttf',
            './src/assets/fonts/SourceSans3-BoldItalic.ttf',
            './src/assets/fonts/SourceSans3-Bold.ttf',
            './src/assets/fonts/SourceSans3-ExtraBoldItalic.ttf',
            './src/assets/fonts/SourceSans3-ExtraBold.ttf',
            './src/assets/fonts/SourceSans3-ExtraLightItalic.ttf',
            './src/assets/fonts/SourceSans3-ExtraLight.ttf',
            './src/assets/fonts/SourceSans3-LightItalic.ttf',
            './src/assets/fonts/SourceSans3-Light.ttf',
            './src/assets/fonts/SourceSans3-MediumItalic.ttf',
            './src/assets/fonts/SourceSans3-Medium.ttf',
            './src/assets/fonts/SourceSans3-Regular.ttf',
            './src/assets/fonts/SourceSans3-SemiBoldItalic.ttf',
            './src/assets/fonts/SourceSans3-SemiBold.ttf',
            './src/assets/fonts/Poppins-ThinItalic.ttf',
            './src/assets/fonts/Poppins-Thin.ttf',
            './src/assets/fonts/Poppins-ExtraLight.ttf',
            './src/assets/fonts/Poppins-ExtraLightItalic.ttf',
            './src/assets/fonts/Poppins-Light.ttf',
            './src/assets/fonts/Poppins-LightItalic.ttf',
            './src/assets/fonts/Poppins-Regular.ttf',
            './src/assets/fonts/Poppins-Medium.ttf',
            './src/assets/fonts/Poppins-MediumItalic.ttf',
            './src/assets/fonts/Poppins-SemiBold.ttf',
            './src/assets/fonts/Poppins-SemiBoldItalic.ttf',
            './src/assets/fonts/Poppins-Bold.ttf',
            './src/assets/fonts/Poppins-BoldItalic.ttf',
            './src/assets/fonts/Poppins-ExtraBold.ttf',
            './src/assets/fonts/Poppins-ExtraBoldItalic.ttf',
            './src/assets/fonts/Poppins-Black.ttf',
            './src/assets/fonts/Poppins-BlackItalic.ttf',
            './src/assets/fonts/Inter-Regular.ttf',
            './src/assets/fonts/Inter-SemiBold.ttf',
            './src/assets/fonts/Inter-Bold.ttf',
          ],
        },
      ],
    ],
  };
};
