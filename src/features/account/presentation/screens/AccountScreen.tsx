import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthSession } from '@features/auth';
import { useErrorModal } from '@src/lib/error-modal';
import { useRevenueCat } from '@src/lib/revenuecat';
import { AccountBody } from '../components/AccountBody';

/**
 * Connected wrapper for the account settings hub. Pulls the auth session
 * (for the read-only email), the RevenueCat state + restore/manage
 * calls, and the router; hands them to `AccountBody` as props.
 *
 * Holds the auth email (read-only), subscription controls (Restore
 * Purchase + Manage Subscription when there's history), and the
 * destructive Delete Account entry point. These used to live inline in
 * the menu drawer. Splitting them into a dedicated screen keeps the
 * drawer focused on navigation targets and keeps the account-level
 * actions in one predictable place.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the screen looks like, and Storybook renders that body directly.
 * Extracting it means the same pixels ship in production and in
 * stories, with no parallel preview composition to keep in sync.
 */
export const AccountScreen = () => {
  const router = useRouter();
  const { data: user } = useAuthSession();
  const { isPro, isLapsed, restorePurchases, openManageSubscription } =
    useRevenueCat();
  const { showError, showFromError } = useErrorModal();
  const hasSubscriptionHistory = isPro || isLapsed;

  const handleManageSubscription = useCallback(async () => {
    try {
      await openManageSubscription();
    } catch (error) {
      showFromError(error, "Couldn't open settings");
    }
  }, [openManageSubscription, showFromError]);

  const handleRestorePurchases = useCallback(async () => {
    try {
      const restored = await restorePurchases();
      showError({
        title: restored ? 'Subscription restored' : 'No purchases found',
        message: restored
          ? 'Your subscription is active again.'
          : 'We couldn’t find any active subscriptions tied to this account.',
      });
    } catch (error) {
      showFromError(error, 'Restore Failed');
    }
  }, [restorePurchases, showError, showFromError]);

  return (
    <AccountBody
      email={user?.email ?? ''}
      hasSubscriptionHistory={hasSubscriptionHistory}
      onGoBack={() => router.back()}
      onRestorePurchases={() => {
        void handleRestorePurchases();
      }}
      onManageSubscription={() => {
        void handleManageSubscription();
      }}
      onDeleteAccount={() => router.push('/delete-account')}
    />
  );
};
