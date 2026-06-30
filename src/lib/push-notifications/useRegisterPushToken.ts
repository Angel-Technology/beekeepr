import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { accountService } from '@features/account';

/**
 * Registers the device for remote pushes after auth resolves. Runs the
 * permission prompt, fetches the native APNs/FCM token, and POSTs it to
 * the backend via `accountService.registerPushToken`. The mutation is
 * idempotent — re-running on every cold start lets the backend refresh
 * `last_seen_at` without dedupe work on the client.
 *
 * Skips entirely on the simulator (`Device.isDevice === false`) — APNs
 * does not vend tokens to the iOS Simulator.
 *
 * Pass the signed-in user's id so the hook re-runs (and re-registers
 * the token under the new account) when a user switches.
 */
export const useRegisterPushToken = (userId: string | null | undefined) => {
  useEffect(() => {
    if (!userId) {
      return;
    }
    const run = async () => {
      if (!Device.isDevice) {
        return;
      }
      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;
      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }
      if (status !== 'granted') {
        return;
      }
      try {
        const { data: token } = await Notifications.getDevicePushTokenAsync();
        await accountService.registerPushToken(
          token,
          Platform.OS === 'ios' ? 'ios' : 'android',
        );
      } catch (error) {
        // Best-effort — registration failure shouldn't block the app.
        // The next cold start will retry, and an explicit retry button
        // could be added to settings if this proves flaky.
        console.warn('[push] register failed', error);
      }
    };
    void run();
  }, [userId]);
};
