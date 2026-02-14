// colors.ts
// No theming yet — just a structured, type-safe token system you can grow later.

type Hex = `#${string}`;

/**
 * Primitive design tokens (foundation layer)
 * - Raw values only
 * - Reusable across future themes (light/dark)
 */
export const primitives = {
  brand: {
    primary: '#A96BCA',
    darker: '#7F53A2',
    lighter: '#DC9CF5',
    accent: '#FFB04F',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#EEEEEE',
    100: '#DDDDDD',
    200: '#B2B2B2',
    300: '#808080',
    400: '#4D4D4D',
    900: '#000000',
  },
  alert: {
    success: '#5AB66D',
    warning: '#FDCB00',
    danger: '#CE393B',
  },
} as const satisfies Record<string, Record<string | number, Hex>>;

/**
 * Semantic tokens (what components should consume)
 * - Avoid referencing primitives directly in UI components
 * - Keeps your app consistent and makes future theming trivial
 */
export const colors = {
  // Brand shortcuts (ok to expose if you want)
  brandPrimary: primitives.brand.primary,
  brandDarker: primitives.brand.darker,
  brandLighter: primitives.brand.lighter,
  brandAccent: primitives.brand.accent,

  // Text
  textPrimary: primitives.neutral[900],
  textSecondary: primitives.neutral[400],
  textTertiary: primitives.neutral[300],
  textQuaternary: primitives.neutral[200],
  textPrimaryReversed: primitives.neutral[0],

  textBrandAction: primitives.brand.darker,
  textBrandActionEmphasis: primitives.brand.darker,
  textBrandDefault: primitives.brand.darker,
  textBrandHover: primitives.brand.primary,
  textBrandOnAction: primitives.neutral[0],

  textNeutralDefault: primitives.neutral[400],
  textNeutralHover: primitives.neutral[900],
  textNeutralOnAction: primitives.neutral[0],
  textDisabled: '#A6A6A6' as Hex, // custom value not in neutrals

  // Background
  backgroundNeutralPrimary: primitives.neutral[0],
  backgroundNeutralSecondary: primitives.neutral[50],
  backgroundNeutralTertiary: primitives.neutral[100],
  backgroundNeutralHover: primitives.neutral[900],
  backgroundNeutralDefault: primitives.neutral[400],
  backgroundNeutralTinted: '#EBEBEB' as Hex,
  backgroundNeutralTintedHover: '#D6D6D6' as Hex,

  backgroundBrandPrimary: primitives.neutral[0],
  backgroundBrandSecondary: '#F8EBFD' as Hex,
  backgroundBrandTertiary: '#F1D9FB' as Hex,
  backgroundBrandSolid: primitives.brand.primary,
  backgroundBrandSolidHover: primitives.brand.darker,
  backgroundBrandTinted: '#F8EBFD' as Hex, // fixed invalid hex from original
  backgroundBrandTintedHover: '#F1D9FB' as Hex,

  backgroundDisabled: '#CCCCCC' as Hex,
  backgroundSpecialContrast: '#D977C0' as Hex,

  // Border
  borderNeutralPrimary: '#D6D6D6' as Hex,
  borderNeutralSecondary: '#E0E0E0' as Hex,
  borderNeutralTertiary: '#EBEBEB' as Hex,
  borderNeutralBorder: primitives.neutral[200],
  borderNeutralBorderHover: primitives.neutral[900],

  borderBrandBorder: '#EDCDFA' as Hex,
  borderBrandBorderHover: primitives.brand.primary,
  borderDisabled: '#CCCCCC' as Hex,

  // Alerts
  alertSuccess: primitives.alert.success,
  alertWarning: primitives.alert.warning,
  alertDanger: primitives.alert.danger,
} as const satisfies Record<string, Hex>;

export type Colors = typeof colors;
