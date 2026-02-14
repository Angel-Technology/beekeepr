import { ExpoConfig, ConfigContext } from 'expo/config';
import {
  loadDeployConfig,
  getAppVariant,
  getEnvironmentConfig,
} from './src/domain/utils/config.ts';

export default ({ config }: ConfigContext): ExpoConfig => {
  const deployConfig = loadDeployConfig(__dirname);
  const variant = getAppVariant();
  const envConfig = getEnvironmentConfig(deployConfig, variant);

  return {
    ...config,
    name: envConfig.name,
    slug: 'da-template',
    version: '0.0.1',
    orientation: 'portrait',
    scheme: envConfig.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: envConfig.bundleIdentifier,
      buildNumber: '0',
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [envConfig.scheme],
          },
        ],
      },
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: envConfig.androidPackage,
      versionCode: 0,
    },
    icon: envConfig.icon,
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/splash-icon.png',
          imageWidth: 302,
          resizeMode: 'contain',
          backgroundColor: '#F6F7F9',
          android: {
            image: './src/assets/images/splash-icon-android.png',
            imageWidth: 240,
            resizeMode: 'contain',
            backgroundColor: '#F6F7F9',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};
