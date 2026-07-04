import { createContext, useContext, type PropsWithChildren } from 'react';
import { useThemePreference, type ThemePreference } from './useThemePreference';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

/**
 * Mounts `useThemePreference` once and shares its state via context.
 * Any descendant can read or write the theme via
 * `useThemePreferenceContext()` — typically the menu drawer's
 * Appearance row.
 */
export const ThemePreferenceProvider = ({ children }: PropsWithChildren) => {
  const value = useThemePreference();
  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreferenceContext = () => {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error(
      'useThemePreferenceContext must be used within ThemePreferenceProvider',
    );
  }
  return ctx;
};
