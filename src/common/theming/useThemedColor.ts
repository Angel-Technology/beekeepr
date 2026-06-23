import { useColorScheme } from 'nativewind';

import type { ColorValue } from '../colors';
import {
  resolveThemedColor,
  type ColorScheme,
  type ThemedColor,
} from './themedColor';

/**
 * Resolves a {@link ThemedColor} to its concrete color string against the
 * active NativeWind color scheme.
 *
 * Reach for this whenever you have to thread a color through a non-className
 * API — SVG `fill` / `stroke` props, StatusBar style, native module options,
 * or any other surface that can't accept a Tailwind utility class.
 *
 * Example:
 *
 * ```tsx
 * const appleIconColor = useThemedColor(themedColors.text.primary);
 * return <AppleIcon color={appleIconColor} />;
 * ```
 */
export const useThemedColor = (color: ThemedColor): ColorValue => {
  const { colorScheme } = useColorScheme();
  // `useColorScheme` reports `'light' | 'dark' | undefined`. The undefined
  // window is the brief pre-paint moment before NativeWind reads the system
  // scheme; default to light so callers always receive a concrete value.
  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
  return resolveThemedColor(color, scheme);
};
