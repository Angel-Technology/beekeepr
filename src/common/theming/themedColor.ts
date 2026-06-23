import type { ColorValue } from '../colors';

/**
 * A color whose concrete value may depend on the active theme.
 *
 * Modeled as a tagged union — `static` covers colors that ignore the theme
 * (a primitive black or a hardcoded brand yellow); `themed` carries the
 * light/dark pair that flips with the active scheme.
 *
 * Why a union (not just `{ light, dark }`): keeping `static` as its own
 * variant makes intent explicit at the call site. `themed('#000', '#000')`
 * reads as "this differs between modes but happens to land on the same
 * value", which is the wrong story for things that are always black.
 *
 * @see resolveThemedColor for the matching switch.
 */
export type ThemedColor =
  | { readonly kind: 'static'; readonly value: ColorValue }
  | {
      readonly kind: 'themed';
      readonly light: ColorValue;
      readonly dark: ColorValue;
    };

/** The two color schemes NativeWind drives via `darkMode: 'class'`. */
export type ColorScheme = 'light' | 'dark';

/** Constructor for a theme-flipping color. */
export const themed = (light: ColorValue, dark: ColorValue): ThemedColor => ({
  kind: 'themed',
  light,
  dark,
});

/** Constructor for a fixed color that ignores the theme. */
export const staticColor = (value: ColorValue): ThemedColor => ({
  kind: 'static',
  value,
});

const assertNever = (x: never): never => {
  throw new Error(`Unhandled ThemedColor variant: ${JSON.stringify(x)}`);
};

/**
 * Pure resolver. Lives outside the hook so it can be called in non-React
 * contexts (services, tests, imperative APIs) — the hook is a thin wrapper
 * that adds only the React Hook ceremony around this function.
 */
export const resolveThemedColor = (
  color: ThemedColor,
  scheme: ColorScheme,
): ColorValue => {
  switch (color.kind) {
    case 'static':
      return color.value;
    case 'themed':
      return scheme === 'dark' ? color.dark : color.light;
    default:
      return assertNever(color);
  }
};
