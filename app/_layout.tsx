import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthSession } from '@features/auth';

import '../global.css';
import { useEffect } from 'react';
import { QueryProvider } from '@src/lib/tanstack/QueryProvider';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { data: user, isPending } = useAuthSession();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (isPending) {
    return null;
  }

  const isAuthenticated = Boolean(user);

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="(public)"
          options={{
            headerShown: false,
            title: 'Public',
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="(private)"
          options={{
            headerShown: false,
            title: 'Private',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
