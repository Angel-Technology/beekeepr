/**
 * Central registry for every AsyncStorage key the app reads or writes.
 * One source of truth so we can grep for collisions and bump versions
 * intentionally. Append `:vN` to a value and bump it whenever a stored
 * payload's shape or meaning changes — that resets the entry for all
 * existing users without touching the consumer code.
 */
export const storageKeys = {
  safetyDisclaimer: 'safety-disclaimer:v1',
  themePreference: 'theme-preference:v1',
} as const satisfies Record<string, string>;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];
