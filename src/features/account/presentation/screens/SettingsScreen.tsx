import { useRouter } from 'expo-router';
import { SettingsBody } from '../components/SettingsBody';

/**
 * Connected wrapper for the Settings screen. Owns only the router; the
 * theme-preference read/write happens inside `ThemeMenuRow` via
 * `useThemePreferenceContext`, so this wrapper is trivially small.
 *
 * User-controllable app settings. Currently just theme preference —
 * everything else the drawer used to expose here (newsletter, marketing,
 * notifications) is either owned by the OS (notifications) or not yet a
 * real product concept. We add rows as those land.
 *
 * Why a thin wrapper: keeps the body renderable under Storybook without
 * mocking `useRouter`, and matches the pattern used across the account
 * and verification features.
 */
export const SettingsScreen = () => {
  const router = useRouter();

  return <SettingsBody onGoBack={() => router.back()} />;
};
