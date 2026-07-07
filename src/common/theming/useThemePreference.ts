import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';
import { storageKeys } from '../storage/keys';

export type ThemePreference = 'system' | 'light' | 'dark';

/**
 * Dark-first product → no stored value yet means dark. Existing users
 * who explicitly picked something else have their choice persisted.
 */
export const DEFAULT_THEME: ThemePreference = 'dark';

const STORAGE_KEY = storageKeys.themePreference;

const VALID: ReadonlyArray<ThemePreference> = ['system', 'light', 'dark'];

const isValidPreference = (value: unknown): value is ThemePreference =>
  typeof value === 'string' && VALID.includes(value as ThemePreference);

const apply = (pref: ThemePreference) => colorScheme.set(pref);

/**
 * Bridges AsyncStorage ↔ NativeWind's `colorScheme`. Reads the stored
 * preference on mount and applies it; exposes a setter that updates
 * NativeWind + storage in one call. Falls back to `DEFAULT_THEME` on
 * any read error or missing value.
 *
 * Cold-start flash: `app/_layout.tsx` sets `colorScheme` to the default
 * at module load so the first paint is correct for the dark-default
 * case. Users who picked light / system will see one extra render as
 * the stored value lands — acceptable for now; killable by switching
 * to MMKV (synchronous storage) later.
 */
export const useThemePreference = () => {
  const [preference, setPreferenceState] =
    useState<ThemePreference>(DEFAULT_THEME);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (cancelled) {
          return;
        }
        if (isValidPreference(value)) {
          setPreferenceState(value);
          apply(value);
        } else {
          apply(DEFAULT_THEME);
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        apply(DEFAULT_THEME);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    apply(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { preference, setPreference };
};
