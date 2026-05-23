import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  BottomActionBar,
  Button,
  DetailCard,
  IconButton,
} from '@components';
import { environmentConfig } from '@src/lib/config/environment';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { DeleteAccountConfirmModal } from '../components/DeleteAccountConfirmModal';

const CONSEQUENCES: readonly string[] = [
  'Your profile, activity, and account data will be permanently removed after 72 hours',
  'You will lose access to your trust signal and any associated status, and your badge will be removed from any partnered dating apps',
  'Deleting the app or your account does not cancel any active subscriptions. To cancel, go to your device’s subscription settings (App Store or Google Play) and manage your subscription there',
  'If you cancel your subscription, you will lose any discounted pricing associated with it',
  'If you keep your subscription active and reinstall the app, tap Restore Purchases to regain access and continue at your current rate',
  'Any discounts you qualified for will not be reinstated if you create a new account',
];

const openPrivacyPolicy = () => {
  const url = environmentConfig.privacyPolicyURL.trim();
  if (!url) {
    return;
  }
  void WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
  });
};

export const DeleteAccountScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { confirmDelete, isDeleting } = useDeleteAccount();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    confirmDelete();
  };

  const handleDismissConfirm = () => {
    if (isDeleting) {
      return;
    }
    setIsConfirmOpen(false);
  };

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} color="#000000" />}
            onPress={() => router.back()}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
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
        <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
          Are you sure you want to delete your account?
        </Text>

        <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
          Your account will be scheduled for deletion and deactivated
          immediately. You will have 72 hours to restore your account if you
          change your mind. After 72 hours, your account and associated data
          will be permanently deleted. We may retain certain information as
          required for legal purposes, as outlined in our{' '}
          <Text
            accessibilityRole="link"
            onPress={openPrivacyPolicy}
            className="text-text-informational"
          >
            Privacy Policy
          </Text>
          .
        </Text>

        <DetailCard
          tone="neutral"
          title="What happens if you delete your account:"
          items={[...CONSEQUENCES]}
          titleClassName="font-lexend-semiBold text-sm leading-tight text-text-secondary"
          itemTextClassName="font-lexend-regular text-xs leading-[18px] text-text-secondary"
        />

        <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
          If you log back in within 72 hours, your account will be restored.
        </Text>
      </ScrollView>

      <BottomActionBar>
        <Button
          label="Cancel"
          variant="solid"
          disabled={isDeleting}
          onPress={() => router.back()}
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
