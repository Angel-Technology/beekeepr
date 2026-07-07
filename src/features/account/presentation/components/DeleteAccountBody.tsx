import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  BottomActionBar,
  Button,
  DetailCard,
  IconButton,
} from '@components';
import { themedColors, useThemedColor } from '@common';
import { DeleteAccountConfirmModal } from './DeleteAccountConfirmModal';

const CONSEQUENCES: readonly string[] = [
  'Your profile, activity, and account data will be permanently removed after 72 hours',
  'You will lose access to your trust signal and any associated status, and your badge will be removed from any partnered dating apps',
  'Deleting the app or your account does not cancel any active subscriptions. To cancel, go to your device’s subscription settings (App Store or Google Play) and manage your subscription there',
  'If you cancel your subscription, you will lose any discounted pricing associated with it',
  'If you keep your subscription active and reinstall the app, tap Restore Purchases to regain access and continue at your current rate',
  'Any discounts you qualified for will not be reinstated if you create a new account',
];

type DeleteAccountBodyProps = {
  /**
   * `true` while the `requestAccountDeletion` mutation is in flight —
   * disables the Cancel + Manage Subscription buttons and shows a
   * loading spinner on the Delete Account button. Also blocks the
   * confirm modal from dismissing so the user can't back out mid-request.
   */
  isDeleting: boolean;
  /**
   * `true` when the user has (or previously had) a paid subscription.
   * Maps to `isPro || isLapsed`; controls whether the Manage Subscription
   * button appears above the bottom action bar.
   */
  hasSubscriptionHistory: boolean;
  /** Header back button. Parent calls `router.back()`. */
  onGoBack: () => void;
  /**
   * Inline "Privacy Policy" link tap in the intro paragraph. Parent
   * opens the URL from `environmentConfig` in the in-app browser.
   */
  onOpenPrivacyPolicy: () => void;
  /**
   * Manage Subscription button tap. Only shown when
   * `hasSubscriptionHistory` is true.
   */
  onManageSubscription: () => void;
  /** Cancel button tap. Parent calls `router.back()`. */
  onCancel: () => void;
  /**
   * Called when the user confirms the destructive action inside the
   * confirm modal. Parent fires the `requestAccountDeletion` mutation.
   */
  onConfirmDelete: () => void;
};

/**
 * Pure presentation body for the Delete Account confirmation screen.
 * Renders the intro copy, the consequences `DetailCard`, the optional
 * Manage Subscription button, and the Cancel + Delete Account action
 * bar. Owns local state for the confirm-modal open/closed flag; every
 * other side effect (mutation firing, browser opening, navigation)
 * lives in the connected screen.
 *
 * Preserves the existing tk-token styling and `DetailCard tone="neutral"`
 * exactly — this screen was styled independently and the visual isn't
 * regressed by the body split.
 */
export const DeleteAccountBody = ({
  isDeleting,
  hasSubscriptionHistory,
  onGoBack,
  onOpenPrivacyPolicy,
  onManageSubscription,
  onCancel,
  onConfirmDelete,
}: DeleteAccountBodyProps) => {
  const insets = useSafeAreaInsets();
  const chevronColor = useThemedColor(themedColors.text.primary);
  const cardIconColor = useThemedColor(themedColors.text.primary);

  // Local UI state — the confirm modal opens over the screen when the
  // user taps Delete Account and dismisses on cancel / confirm.
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    onConfirmDelete();
  };

  const handleDismissConfirm = () => {
    if (isDeleting) {
      return;
    }
    setIsConfirmOpen(false);
  };

  return (
    <View className="flex-1 bg-tk-bg-primary">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={
              <ChevronLeft size={24} strokeWidth={2.2} color={chevronColor} />
            }
            onPress={onGoBack}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-tk-text-primary">
            Delete Account
          </Text>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-lexend-semiBold text-base leading-6 text-tk-text-primary">
          Are you sure you want to delete your account?
        </Text>

        <Text className="font-lexend-regular text-sm leading-5 text-tk-text-secondary">
          Your account will be scheduled for deletion and deactivated
          immediately. You will have 72 hours to restore your account if you
          change your mind. After 72 hours, your account and associated data
          will be permanently deleted. We may retain certain information as
          required for legal purposes, as outlined in our{' '}
          <Text
            accessibilityRole="link"
            onPress={onOpenPrivacyPolicy}
            className="text-tk-text-informational"
          >
            Privacy Policy
          </Text>
          .
        </Text>

        <DetailCard
          tone="neutral"
          title="What happens if you delete your account:"
          items={[...CONSEQUENCES]}
          className="bg-tk-bg-secondary"
          titleClassName="font-lexend-semiBold text-sm leading-tight text-tk-text-secondary"
          itemTextClassName="font-lexend-regular text-xs leading-[18px] text-tk-text-secondary"
        />

        <Text className="font-lexend-regular text-sm leading-5 text-tk-text-secondary">
          If you log back in within 72 hours, your account will be restored.
        </Text>

        {hasSubscriptionHistory ? (
          <Button
            label="Manage Subscription"
            variant="outline"
            iconLeft={
              <CreditCard size={20} color={cardIconColor} strokeWidth={2} />
            }
            disabled={isDeleting}
            onPress={onManageSubscription}
          />
        ) : null}
      </ScrollView>

      <BottomActionBar>
        <Button
          label="Cancel"
          variant="solid"
          disabled={isDeleting}
          onPress={onCancel}
        />
        <Button
          label="Delete Account"
          variant="outline"
          tone="critical"
          loading={isDeleting}
          onPress={() => setIsConfirmOpen(true)}
        />
      </BottomActionBar>

      <DeleteAccountConfirmModal
        visible={isConfirmOpen}
        isDeleting={isDeleting}
        onConfirm={handleConfirm}
        onCancel={handleDismissConfirm}
      />
    </View>
  );
};
