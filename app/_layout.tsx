import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Landing',
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
  );
}
