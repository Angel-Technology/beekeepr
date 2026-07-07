import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  KeyboardProvider,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colorScheme } from 'nativewind';
import { ConfirmDestructiveProvider } from '@components';
import {
  DEFAULT_THEME,
  ThemePreferenceProvider,
  themedColors,
  useThemedColor,
} from '@common';
import { useAuthSession } from '@features/auth';
import { PushNotificationsProvider } from '@src/lib/push-notifications';

import '../global.css';
import { useEffect, useState, type ComponentType } from 'react';
import { DevSettings } from 'react-native';
import { QueryProvider } from '@src/lib/tanstack/QueryProvider';
import { RevenueCatProvider } from '@src/lib/revenuecat';
import { GlobalLoaderProvider, GlobalLoaderOverlay } from '@src/lib/loader';
import { ErrorModalProvider } from '@src/lib/error-modal';
import { RootErrorBoundary } from '@src/lib/error-boundary';
import { initSentry, wrapRootComponent } from '@src/lib/sentry';

// Module-load default so the first paint is correct for the dark-default
// case before AsyncStorage resolves. `ThemePreferenceProvider` reads the
// user's stored choice on mount and re-applies via `colorScheme.set` if
// it differs — users who picked light / system see one extra render on
// cold start.
colorScheme.set(DEFAULT_THEME);

// Fire at module load — before any provider mounts — so the SDK is ready to
// receive `captureException` calls from `RootErrorBoundary` on first render.
// No-ops in __DEV__ or when EXPO_PUBLIC_SENTRY_DSN is unset.
initSentry();

SplashScreen.preventAutoHideAsync();

// Storybook is bundled into every dev build (see `metro.config.js`) so the
// in-app toggle can flip to it without a Metro restart. In production we only
// require it when the caller explicitly opted in via the env var.
const storybookAvailable =
  __DEV__ || process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

let StorybookUIRoot: ComponentType<Record<string, never>> | undefined;
if (storybookAvailable) {
  StorybookUIRoot = require('../.rnstorybook').default;
}

function RootNavigator() {
  const { data: user, isPending } = useAuthSession();
  // Theme-aware screen container so push/pop transitions don't expose
  // the Stack's default white background mid-animation.
  const screenBg = useThemedColor(themedColors.bg.primary);

  // Hold the native splash until the auth session has resolved. Hiding
  // unconditionally on mount drops us into the `isPending` `return null`
  // branch with no view behind the splash, which renders as a black flash
  // on release builds (TestFlight / Play internal) between splash and the
  // first navigator frame.
  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  const isAuthenticated = Boolean(user);

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: screenBg } }}>
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

function RootLayout() {
  const [storybookEnabled, setStorybookEnabled] = useState(
    process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  );

  useEffect(() => {
    if (storybookEnabled) {
      SplashScreen.hideAsync();
    }
  }, [storybookEnabled]);

  // Register a "Toggle Storybook" entry in the React Native dev menu
  // (shake / Cmd+D on iOS sim / Cmd+M on Android). `addMenuItem` has no
  // removal API, so we register once — the functional setter reads the
  // latest value without needing the effect to re-run.
  useEffect(() => {
    if (!__DEV__) {
      return;
    }
    DevSettings.addMenuItem('Toggle Storybook', () => {
      setStorybookEnabled((prev) => !prev);
    });
  }, []);

  if (storybookEnabled && StorybookUIRoot) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <ErrorModalProvider>
              <GlobalLoaderProvider>
                <BottomSheetModalProvider>
                  <ThemePreferenceProvider>
                    <ConfirmDestructiveProvider>
                      <StorybookUIRoot />
                    </ConfirmDestructiveProvider>
                  </ThemePreferenceProvider>
                  <GlobalLoaderOverlay />
                </BottomSheetModalProvider>
              </GlobalLoaderProvider>
            </ErrorModalProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <QueryProvider>
          <SafeAreaProvider>
            <RootErrorBoundary>
              <RevenueCatProvider>
                <ErrorModalProvider>
                  <GlobalLoaderProvider>
                    <BottomSheetModalProvider>
                      <ThemePreferenceProvider>
                        <ConfirmDestructiveProvider>
                          <PushNotificationsProvider>
                            <RootNavigator />
                          </PushNotificationsProvider>
                        </ConfirmDestructiveProvider>
                      </ThemePreferenceProvider>
                      <GlobalLoaderOverlay />
                    </BottomSheetModalProvider>
                  </GlobalLoaderProvider>
                </ErrorModalProvider>
              </RevenueCatProvider>
            </RootErrorBoundary>
          </SafeAreaProvider>
        </QueryProvider>
        <KeyboardToolbar />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

// `wrapRootComponent` enables Sentry's React Navigation / performance
// instrumentation when initialised, and is an identity pass-through when
// Sentry is disabled in __DEV__.
export default wrapRootComponent(RootLayout);
