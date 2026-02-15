import { ExpoConfig, ConfigContext } from 'expo/config';

type EnvironmentConfig = {
  name: string;
  slug: string;
  scheme: string;

  // icon assets
  icon: string;
  // platform identifiers
  bundleIdentifier: string;
  androidPackage: string;

  // adaptive icon assets (android)
  androidAdaptiveIconForeground: string;
  androidAdaptiveIconBackgroundColor: string;
};

const APP: EnvironmentConfig = {
  name: 'Beekeepr',
  slug: 'beekeepr',
  scheme: 'beekeepr',

  icon: './src/assets/images/app-icon.png',

  bundleIdentifier: 'com.beekeepr.app',
  androidPackage: 'com.beekeepr.app',

  androidAdaptiveIconForeground: './src/assets/images/adaptive-icon.png',
  androidAdaptiveIconBackgroundColor: '#ffffff',
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

    // Fallback icon (Expo requires this; use your preferred default)
    icon: APP.icon,

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: APP.bundleIdentifier,
      buildNumber: config.ios?.buildNumber ?? '1',

      // iOS app icon (static). Pick the best looking one (usually light bg).
      icon: APP.icon,

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

      // Android app icon setup
      icon: APP.icon, // legacy (some launchers still use this)

      adaptiveIcon: {
        foregroundImage: APP.androidAdaptiveIconForeground,
        backgroundColor: APP.androidAdaptiveIconBackgroundColor,
      },

      edgeToEdgeEnabled: true,
    },

    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/splash-icon.png',
          dark: {
            image: './src/assets/images/splash-icon.png',
            backgroundColor: '#151718',
          },
          backgroundColor: '#ECEDEE',
          resizeMode: 'cover',
        },
      ],
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
