import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Register Android notification channels at module load. Android 8+
 * (API 26) requires every notification to belong to a channel — without
 * an explicit one, our pushes fall into Expo's `Miscellaneous` default
 * bucket, which some vendor ROMs (Samsung One UI, Xiaomi MIUI, OPPO
 * ColorOS) silently drop and which reads as a generic label in system
 * settings.
 *
 * No-op on iOS (channels are Android-only). Safe to run on every cold
 * start — `setNotificationChannelAsync` is idempotent by id.
 *
 * The backend push payload should set `"channelId": "default"` in the
 * FCM `notification` block so Android routes the delivery to this
 * channel; if the field is omitted, Android falls back to its own
 * default and the visual grouping/importance below is ignored.
 */
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'General',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#FFD400',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    // Omit `sound` — expo-notifications treats any non-null string as a
    // custom filename it looks up in the app bundle, and a missing file
    // throws "Custom sound '<name>' not found." Leaving it undefined
    // opts into the OS system default notification sound instead.
    vibrationPattern: [0, 250, 250, 250],
  }).catch((error) => {
    // Best-effort — a channel registration failure shouldn't crash the
    // app. The OS keeps whatever channel was previously registered.
    console.warn('[push] setNotificationChannelAsync failed', error);
  });
}
