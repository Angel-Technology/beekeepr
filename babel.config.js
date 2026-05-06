/** @type {import('@babel/core').ConfigFunction} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: 'nativewind',
          unstable_transformImportMeta: true,
        },
      ],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@src': './src',
            '@assets': './src/assets',
            '@common': './src/common',
            '@components': './src/components',
            '@features': './src/features',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
