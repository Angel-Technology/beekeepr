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

module.exports = withStorybook(reanimatedConfig, {
  configPath: './.rnstorybook',
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
