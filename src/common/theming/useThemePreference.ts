import { useCallback, useEffect, useRef, useState } from 'react';
import { Appearance, type NativeEventSubscription } from 'react-native';
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

const resolveSystemScheme = (): 'light' | 'dark' =>
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

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
  const systemListener = useRef<NativeEventSubscription | null>(null);

  // NativeWind 4.x maps `colorScheme.set('system')` to
  // `Appearance.setColorScheme(null)`, which crashes RN 0.83's Kotlin
  // `AppearanceModule` (non-null `style` param). Resolve the OS scheme
  // ourselves and keep NativeWind fed with only 'light' | 'dark'.
  const apply = useCallback((pref: ThemePreference) => {
    systemListener.current?.remove();
    systemListener.current = null;
    if (pref === 'system') {
      colorScheme.set(resolveSystemScheme());
      systemListener.current = Appearance.addChangeListener(() => {
        colorScheme.set(resolveSystemScheme());
      });
    } else {
      colorScheme.set(pref);
    }
  }, []);

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
      systemListener.current?.remove();
      systemListener.current = null;
    };
  }, [apply]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      apply(next);
      void AsyncStorage.setItem(STORAGE_KEY, next);
    },
    [apply],
  );

  return { preference, setPreference };
};
