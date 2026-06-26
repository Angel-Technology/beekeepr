import { Stack } from 'expo-router';
import { themedColors, useThemedColor } from '@common';

export default function PublicLayout() {
  // Theme-aware so the auth-flow stack transitions don't expose the
  // Stack's default white container against the dark onboarding bg.
  const screenBg = useThemedColor(themedColors.bg.primary);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: screenBg },
      }}
    />
  );
}
