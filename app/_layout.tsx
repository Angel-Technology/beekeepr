import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              title: 'Landing',
            }}
          />
          <Stack.Screen
            name="onboarding/what-we-do"
            options={{
              headerShown: false,
              title: 'What We Do',
            }}
          />
          <Stack.Screen
            name="onboarding/create-account"
            options={{
              headerShown: false,
              title: 'Create Account',
            }}
          />
          {/* <Stack.Screen
        name="+not-found"
        options={{
          title: 'Not Found',
          headerShown: false,
          }}
          />
          <Stack.Screen
          name="callback"
          options={{
            headerShown: false,
            title: 'Authentication',
            }}
            /> */}
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
