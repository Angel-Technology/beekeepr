/** @type {import('@babel/core').ConfigFunction} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@src': './src',
            '@assets': './src/assets',
            '@screens': './src/screens',
            '@components': './src/components',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@actions': './src/actions',
            '@data': './src/data',
            '@domain': './src/domain',
          },
        },
      ],
    ],
  };
};
