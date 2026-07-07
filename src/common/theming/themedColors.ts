import { staticColor, themed, type ThemedColor } from './themedColor';

/**
 * Semantic theme tokens — the JS/runtime mirror of the `--tk-*` CSS variables
 * declared in `global.css`. Use these wherever a color needs to be passed to
 * an API that can't take a Tailwind utility (SVG `fill`, StatusBar, etc.).
 *
 * **Single source of truth.** This file and `global.css` are kept manually in
 * lockstep — RN's SVG renderer can't reach into CSS variables at runtime, so
 * the values have to live in JS as well. When the design tokens change,
 * update both.
 *
 * Names mirror the Figma export structure (`brand`, `text`, `bg`, `border`,
 * `gray`, `alerts`) so a lookup like `themedColors.text.primary` matches the
 * Tailwind class `text-tk-text-primary` 1:1.
 */
export const themedColors = {
  brand: {
    primary: themed('#FDD301', '#FFD400'),
    lighter: themed('#FFFAD9', '#FFFFFF'),
    darker: themed('#E5AC03', '#FFD400'),
    accent: themed('#000000', '#DFFD00'),
  },

  text: {
    primary: themed('#000000', '#FFFFFF'),
    secondary: themed('rgba(0, 0, 0, 0.7)', 'rgba(255, 255, 255, 0.7)'),
    tertiary: themed('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.5)'),
    quaternary: themed('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)'),
    primaryReversed: themed('#FFFFFF', '#000000'),
    informational: themed('#1489E6', '#14A5FF'),
  },

  bg: {
    primary: themed('#FFFFFF', '#000000'),
    secondary: themed('#EEEEEE', '#111111'),
    tertiary: themed('#DDDDDD', '#19191A'),
    callout: themed('#FFF8CB', '#222222'),
    elevatedPrimary: themed('#FFFFFF', '#19191A'),
    elevatedSecondary: themed('#EEEEEE', '#222222'),
    elevatedTertiary: themed('#DDDDDD', '#323234'),
  },

  border: {
    primary: themed('rgba(0, 0, 0, 0.32)', 'rgba(255, 255, 255, 0.4)'),
    secondary: themed('rgba(0, 0, 0, 0.16)', 'rgba(255, 255, 255, 0.24)'),
    tertiary: themed('rgba(0, 0, 0, 0.08)', 'rgba(255, 255, 255, 0.16)'),
  },

  gray: {
    black: staticColor('#000000'),
    white: staticColor('#FFFFFF'),
  },

  alerts: {
    success: themed('#00A93E', '#00FF35'),
    warning: themed('#FFBF00', '#FFFF00'),
    danger: staticColor('#FF0000'),
  },
} as const satisfies Readonly<
  Record<string, Readonly<Record<string, ThemedColor>>>
>;
