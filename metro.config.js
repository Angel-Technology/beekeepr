const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

const nativeWindConfig = withNativeWind(config, {
  input: './global.css',
});

const reanimatedConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

// Bundle Storybook in every dev build so the in-app dev-menu toggle can flip
// to it without restarting Metro. Production builds skip it unless the env
// var is set explicitly (e.g. for a Storybook-only EAS artifact), keeping it
// out of the shipped JS bundle.
const isProduction = process.env.NODE_ENV === 'production';
const storybookEnabled =
  !isProduction || process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

module.exports = withStorybook(reanimatedConfig, {
  configPath: './.rnstorybook',
  enabled: storybookEnabled,
});
