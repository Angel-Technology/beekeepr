import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useErrorModal } from '@src/lib/error-modal';
import { useRevenueCat } from '@src/lib/revenuecat';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { DeleteAccountBody } from '../components/DeleteAccountBody';

const openPrivacyPolicy = () => {
  const url = environmentConfig.privacyPolicyURL.trim();
  if (!url) {
    return;
  }
  void WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
  });
};

/**
 * Connected wrapper for the Delete Account confirmation screen. Pulls
 * the deletion mutation state, the RevenueCat manage-subscription entry
 * point, and the router; hands them to `DeleteAccountBody` as props.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the screen looks like, and Storybook renders that body directly. The
 * confirm modal's open/closed state stays inside the body because it's
 * pure UI toggling — the destructive mutation itself lives here.
 */
export const DeleteAccountScreen = () => {
  const router = useRouter();
  const { confirmDelete, isDeleting } = useDeleteAccount();
  const { isPro, isLapsed, openManageSubscription } = useRevenueCat();
  const { showFromError } = useErrorModal();
  const hasSubscriptionHistory = isPro || isLapsed;

  const handleManageSubscription = async () => {
    try {
      await openManageSubscription();
    } catch (error) {
      showFromError(error, "Couldn't open settings");
    }
  };

  return (
    <DeleteAccountBody
      isDeleting={isDeleting}
      hasSubscriptionHistory={hasSubscriptionHistory}
      onGoBack={() => router.back()}
      onOpenPrivacyPolicy={openPrivacyPolicy}
      onManageSubscription={() => {
        void handleManageSubscription();
      }}
      onCancel={() => router.back()}
      onConfirmDelete={confirmDelete}
    />
  );
};
