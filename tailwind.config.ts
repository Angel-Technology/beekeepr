/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    /**
     * App directory - Expo Router file-based routing
     * @description All pages and layouts in the app directory
     */
    './app/**/*.{js,jsx,ts,tsx}',
    /**
     * Components directory
     * @description Reusable component files (if they exist)
     */
    './components/**/*.{js,jsx,ts,tsx}',
    /**
     * Source directory
     * @description Additional source files (if they exist)
     */
    './src/**/*.{js,jsx,ts,tsx}',
    /**
     * Storybook stories directory
     * @description Storybook story files for design system documentation
     */
    './.rnstorybook/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      /**
       * Color system based on Helios Design System
       * Provides semantic color tokens for consistent branding and theming
       */
      colors: {},
      /**
       * Spacing scale - Consistent spacing tokens
       * Provides a harmonious spacing system for layouts and components
       */
      spacing: {},
    },
  },
  plugins: [],
};
