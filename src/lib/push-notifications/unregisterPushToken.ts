import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { accountService } from '@features/account/services/accountService';

/**
 * Drops the device's push token from the signed-in user's backend
 * record. Call this BEFORE clearing the auth session on sign-out —
 * the unregister mutation requires the auth token, and the backend's
 * signOut handler nukes it.
 *
 * Best-effort:
 *  - Simulator → skip silently (no token to drop).
 *  - Token fetch / mutation failure → swallow. The backend cleans up
 *    stale tokens on its own schedule; one missed unregister leaves a
 *    dead row, not a security hole.
 */
export const unregisterPushToken = async (): Promise<void> => {
  if (!Device.isDevice) {
    return;
  }
  try {
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    await accountService.unregisterPushToken(token);
  } catch (error) {
    console.warn('[push] unregister failed', error);
  }
};
