import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthSession } from '@features/auth';

import '../global.css';
import { useEffect, type ComponentType } from 'react';
import { QueryProvider } from '@src/lib/tanstack/QueryProvider';
import { RevenueCatProvider } from '@src/lib/revenuecat';

SplashScreen.preventAutoHideAsync();

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

let StorybookUIRoot: ComponentType<Record<string, never>> | undefined;
if (storybookEnabled) {
  StorybookUIRoot = require('../.rnstorybook').default;
}

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
  useEffect(() => {
    if (storybookEnabled) {
      SplashScreen.hideAsync();
    }
  }, []);

  if (storybookEnabled && StorybookUIRoot) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StorybookUIRoot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <SafeAreaProvider>
          <RevenueCatProvider>
            <RootNavigator />
          </RevenueCatProvider>
        </SafeAreaProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
