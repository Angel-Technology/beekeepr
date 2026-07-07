import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import {
  focusManager,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';
import { createQueryClient } from './queryClient';

// TanStack's `focusManager` defaults to using `document` listeners,
// which don't exist in React Native — so `refetchOnWindowFocus` is a
// no-op out of the box. Bridging `AppState` here lets per-query
// `refetchOnWindowFocus: true` actually fire when the user
// backgrounds and re-enters the app.
const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS === 'web') {
    return;
  }
  focusManager.setFocused(status === 'active');
};

// Same situation for `onlineManager` — without an explicit signal it
// assumes always-online. We don't have a network module wired up yet
// so we keep the assumption, but the import shape is here for when
// `@react-native-community/netinfo` lands.
onlineManager.setOnline(true);

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
