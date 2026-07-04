import * as Notifications from 'expo-notifications';

/**
 * Foreground display behavior. Set at module load so the handler is in
 * place before any push lands.
 *
 * `shouldShowAlert` is the legacy boolean — on SDK 55 / RN 0.79 it's
 * still accepted alongside the newer `shouldShowBanner` + `shouldShowList`
 * pair. Setting both makes the handler forward-compatible.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
