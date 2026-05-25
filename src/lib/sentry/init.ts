import * as Sentry from '@sentry/react-native';
import { environmentConfig } from '@src/lib/config/environment';

let initialized = false;

/**
 * Initialise Sentry exactly once at app boot. No-ops in `__DEV__` so local
 * console errors don't get reported as production issues, and no-ops when
 * `EXPO_PUBLIC_SENTRY_DSN` is unset so PR previews / unconfigured environments
 * don't crash on boot.
 */
export const initSentry = () => {
  if (initialized) {
    return;
  }
  if (__DEV__ && !environmentConfig.enableSentryInDev) {
    return;
  }
  if (!environmentConfig.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: environmentConfig.sentryDsn,
    environment: environmentConfig.appEnv,
    // We surface in-app errors via ErrorModalProvider; default breadcrumbs
    // are enough without enabling Session Replay or perf tracing yet.
    enableAutoSessionTracking: true,
  });

  initialized = true;
};

/**
 * Capture an error to Sentry. Safe to call in dev (no-op) or before init.
 */
export const captureError = (
  error: unknown,
  context?: Record<string, unknown>,
) => {
  if (!initialized) {
    return;
  }
  Sentry.captureException(error, context ? { extra: context } : undefined);
};

export const wrapRootComponent = Sentry.wrap;
