import { Stack } from 'expo-router';

export default function VerifyIdentityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="identity" />
    </Stack>
  );
}
