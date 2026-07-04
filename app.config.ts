import type { ExpoConfig, ConfigContext } from 'expo/config';

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
  name: 'Buzzkeepr',
  slug: 'buzzkeepr',
  scheme: 'buzzkeepr',

  icon: './src/assets/images/app-icon.png',

  bundleIdentifier: 'com.buzzkeepr.app',
  androidPackage: 'com.buzzkeepr.app',

  androidAdaptiveIconForeground: './src/assets/images/adaptive-icon.png',
  androidAdaptiveIconBackgroundColor: '#000000',
};

const ciBuildNumber = Number.parseInt(
  process.env.IOS_BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || '',
  10,
);
const iosBuildNumber =
  Number.isFinite(ciBuildNumber) && ciBuildNumber > 0
    ? String(ciBuildNumber)
    : '1';

const ciVersionCode = Number.parseInt(
  process.env.ANDROID_VERSION_CODE || process.env.GITHUB_RUN_NUMBER || '',
  10,
);
const androidVersionCode =
  Number.isFinite(ciVersionCode) && ciVersionCode > 0 ? ciVersionCode : 1;

// EAS project ID. `eas init` can't write this back into a dynamic
// config (function-export `app.config.ts`), so we own it here. Sync
// with the project's `eas init`/dashboard if it ever changes.
const EAS_PROJECT_ID = '0cba096a-e51e-4ae3-89e8-1c29bacbed90';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,

    name: APP.name,
    slug: APP.slug,
    // EAS account that owns the project (`eas init` writes this; we
    // own it here because the dynamic config can't be auto-mutated).
    owner: 'wemsamuel',
    version: config.version ?? '0.0.1',
    orientation: 'portrait',
    scheme: APP.scheme,
    // Lets iOS support both appearances at the platform level. The
    // app's effective theme is driven by NativeWind via
    // `ThemePreferenceProvider` — the user picks System / Light / Dark
    // in the menu and the choice is persisted.
    userInterfaceStyle: 'automatic',

    // Fallback icon (Expo requires this; use your preferred default)
    icon: APP.icon,

    extra: {
      ...config.extra,
      eas: {
        ...(config.extra?.eas ?? {}),
        projectId: EAS_PROJECT_ID,
      },
    },

    ios: {
      ...config.ios,
      supportsTablet: false,
      bundleIdentifier: APP.bundleIdentifier,
      buildNumber: config.ios?.buildNumber ?? iosBuildNumber,

      // iOS app icon (static). Pick the best looking one (usually light bg).
      icon: APP.icon,

      // Push entitlement value written into `Buzzkeepr.entitlements` on
      // `expo prebuild`. `production` is required for TestFlight / App
      // Store builds so device tokens map to prod APNs. The
      // `expo-notifications` plugin defaults to `development` (safe for
      // local sideloads), which we override here since our Fastlane
      // build always ships to TestFlight — never sideloaded.
      entitlements: {
        ...config.ios?.entitlements,
        'aps-environment': 'production',
      },

      config: {
        ...config.ios?.config,
        usesNonExemptEncryption: false,
      },

      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleDisplayName: APP.name,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [APP.scheme],
          },
        ],
        // Lets the OS wake the app for silent / background pushes
        // (e.g. invalidating a TanStack cache from a `data-only`
        // notification). Without this, only foreground / tap delivery
        // works.
        UIBackgroundModes: ['remote-notification'],
        NSCameraUsageDescription:
          "Buzzkeepr uses the camera to capture your driver's license and selfie for identity verification.",
        NSFaceIDUsageDescription:
          'Buzzkeepr uses Face ID during identity verification to confirm you are the person on your ID.',
        NSLocationWhenInUseUsageDescription:
          'Buzzkeepr uses location during identity verification for fraud prevention and security checks.',
        NSPhotoLibraryUsageDescription:
          'Buzzkeepr can access your photo library if identity verification allows uploading ID images instead of capturing them live.',
      },
    },

    android: {
      ...config.android,
      package: APP.androidPackage,
      versionCode: config.android?.versionCode ?? androidVersionCode,
      googleServicesFile: './google-services.json',

      // Android app icon setup
      icon: APP.icon, // legacy (some launchers still use this)

      adaptiveIcon: {
        foregroundImage: APP.androidAdaptiveIconForeground,
        backgroundColor: APP.androidAdaptiveIconBackgroundColor,
      },
    },

    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-image',
      'expo-web-browser',
      '@react-native-community/datetimepicker',
      '@sentry/react-native/expo',
      [
        // Writes the iOS push entitlement to the generated .entitlements
        // file on `expo prebuild`. `color` sets the Android tint for the
        // notification small icon.
        //
        // TODO(android-push-icon): add a dedicated monochrome white-on-
        // transparent 96×96 PNG (e.g. `src/assets/images/notification-icon.png`)
        // and reference it via an `icon` entry here. Without one, Android
        // uses the colored app icon as the status-bar small icon, which
        // renders as a white blob (Android draws small icons as flat
        // silhouettes). Blocking for a polished Android launch.
        'expo-notifications',
        {
          color: '#FFD400',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/splash-icon-light.png',
          dark: {
            image: './src/assets/images/splash-icon-dark.png',
            backgroundColor: '#000000',
          },
          backgroundColor: '#FFFFFF',
          resizeMode: 'cover',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme:
            'com.googleusercontent.apps.280443449247-82661408bk0p6u7o05h7p0004l82sm43',
        },
      ],
      'expo-apple-authentication',
      './plugins/withPersonaNative',
      './plugins/withAndroidSigning',
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
            './src/assets/fonts/Lexend-Thin.ttf',
            './src/assets/fonts/Lexend-ExtraLight.ttf',
            './src/assets/fonts/Lexend-Light.ttf',
            './src/assets/fonts/Lexend-Regular.ttf',
            './src/assets/fonts/Lexend-Medium.ttf',
            './src/assets/fonts/Lexend-SemiBold.ttf',
            './src/assets/fonts/Lexend-Bold.ttf',
            './src/assets/fonts/Lexend-ExtraBold.ttf',
            './src/assets/fonts/Lexend-Black.ttf',
            './src/assets/fonts/Inter-Regular.ttf',
            './src/assets/fonts/Inter-SemiBold.ttf',
            './src/assets/fonts/Inter-Bold.ttf',
          ],
        },
      ],
    ],
  };
};
