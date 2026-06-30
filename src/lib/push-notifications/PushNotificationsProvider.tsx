import type { PropsWithChildren } from 'react';
import { useAuthSession } from '@features/auth/hooks/useAuthSession';
import './notificationHandler';
import { useRegisterPushToken } from './useRegisterPushToken';

/**
 * Mounted near the root, inside the auth gate. Handles every push
 * concern that should run for the duration of the app lifetime:
 *
 * - Foreground display (via the `notificationHandler` side-effect
 *   import — set at module scope so it's in place before any push
 *   lands).
 * - Token registration after auth resolves.
 *
 * Pure side-effect shell — just renders `children`.
 */
export const PushNotificationsProvider = ({ children }: PropsWithChildren) => {
  const { data: user } = useAuthSession();
  useRegisterPushToken(user?.id ?? null);
  return <>{children}</>;
};
