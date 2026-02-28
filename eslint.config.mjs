import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const featureLayerBoundaries = [
  {
    files: ['src/features/*/repository/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../services',
                '../services/*',
                '../hooks',
                '../hooks/*',
                '../presentation',
                '../presentation/*',
                '@features/*/services',
                '@features/*/services/*',
                '@features/*/hooks',
                '@features/*/hooks/*',
                '@features/*/presentation',
                '@features/*/presentation/*',
              ],
              message:
                'Repository files may not import from services, hooks, or presentation. Keep repository code limited to data access concerns.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../hooks',
                '../hooks/*',
                '../presentation',
                '../presentation/*',
                '../graphql',
                '../graphql/*',
                '@features/*/hooks',
                '@features/*/hooks/*',
                '@features/*/presentation',
                '@features/*/presentation/*',
                '@features/*/graphql',
                '@features/*/graphql/*',
              ],
              message:
                'Service files may not import from hooks, presentation, or graphql. Services should coordinate through repositories.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/hooks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../repository',
                '../repository/*',
                '../graphql',
                '../graphql/*',
                '../presentation',
                '../presentation/*',
                '@features/*/repository',
                '@features/*/repository/*',
                '@features/*/graphql',
                '@features/*/graphql/*',
                '@features/*/presentation',
                '@features/*/presentation/*',
              ],
              message:
                'Hook files may not import from repository, graphql, or presentation. Hooks should go through the service layer.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/presentation/screens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../repository',
                '../repository/*',
                '../../repository',
                '../../repository/*',
                '../services',
                '../services/*',
                '../../services',
                '../../services/*',
                '../graphql',
                '../graphql/*',
                '../../graphql',
                '../../graphql/*',
                '@features/*/repository',
                '@features/*/repository/*',
                '@features/*/services',
                '@features/*/services/*',
                '@features/*/graphql',
                '@features/*/graphql/*',
              ],
              message:
                'Screen files may not import repository, service, or graphql code directly. Screens should depend on hooks and presentation components.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/*/presentation/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../../hooks',
                '../../hooks/*',
                '../../services',
                '../../services/*',
                '../../repository',
                '../../repository/*',
                '../../graphql',
                '../../graphql/*',
                '@features/*/hooks',
                '@features/*/hooks/*',
                '@features/*/services',
                '@features/*/services/*',
                '@features/*/repository',
                '@features/*/repository/*',
                '@features/*/graphql',
                '@features/*/graphql/*',
              ],
              message:
                'Presentation components should stay dumb. Keep data access and orchestration in hooks and pass values in as props.',
            },
          ],
        },
      ],
    },
  },
];

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-const': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...featureLayerBoundaries,
  {
    ignores: [
      'node_modules/',
      'android/',
      'ios/',
      'build/',
      '.expo/',
      'coverage/',
      '*.config.js',
      '*.config.mjs',
      'babel.config.js',
      'metro.config.js',
    ],
  },
];
