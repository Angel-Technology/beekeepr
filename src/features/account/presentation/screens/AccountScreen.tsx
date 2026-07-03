import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArchiveRestore,
  ChevronLeft,
  CreditCard,
  Trash,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, IconButton, Input } from '@components';
import { themedColors, useThemedColor } from '@common';
import { useAuthSession } from '@features/auth';
import { useErrorModal } from '@src/lib/error-modal';
import { useRevenueCat } from '@src/lib/revenuecat';
import { MenuSection } from '../components/MenuSection';

const DELETE_ACCOUNT_COLOR = '#FF0000';
const MENU_ICON_SIZE = 20;

/**
 * Account settings hub. Holds the auth email (read-only), subscription
 * controls (Restore Purchase + Manage Subscription when there's
 * history), and the destructive Delete Account entry point.
 *
 * These used to live inline in the menu drawer. Splitting them into a
 * dedicated screen keeps the drawer focused on navigation targets and
 * keeps the account-level actions in one predictable place.
 */
export const AccountScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();
  const { isPro, isLapsed, restorePurchases, openManageSubscription } =
    useRevenueCat();
  const { showError, showFromError } = useErrorModal();
  const hasSubscriptionHistory = isPro || isLapsed;
  const chevronColor = useThemedColor(themedColors.text.primary);
  const menuIconColor = useThemedColor(themedColors.text.primary);

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
    <View className="bg-tk-bg-primary flex-1">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={
              <ChevronLeft size={24} strokeWidth={2.2} color={chevronColor} />
            }
            onPress={() => router.back()}
          />
        }
        center={
          <Text className="text-tk-text-primary font-poppins-semiBold text-base">
            Account
          </Text>
        }
      />

      <View
        className="flex-1"
        style={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
          gap: 16,
        }}
      >
        <View className="w-full gap-2 px-1">
          <Text className="text-tk-text-secondary font-lexend-regular text-footnote leading-[18px]">
            EMAIL ADDRESS
          </Text>
          <Text className="text-tk-text-secondary font-lexend-regular text-footnote leading-[18px]">
            This is the email address being used for your login and email
            communication.
          </Text>
        </View>

        <View className="border-tk-border-secondary w-full rounded-lg border p-4">
          <Input
            label="Email address"
            value={user?.email ?? ''}
            onChangeText={() => {}}
            disabled
          />
        </View>

        <MenuSection
          items={[
            {
              label: 'Restore Purchase',
              icon: (
                <ArchiveRestore size={MENU_ICON_SIZE} color={menuIconColor} />
              ),
              onPress: () => {
                void handleRestorePurchases();
              },
            },
            // Only surface Manage Subscription once the user has (or
            // had) a paid plan — RevenueCat's manage-subscription
            // deep link errors for accounts with no subscription
            // history at all.
            ...(hasSubscriptionHistory
              ? [
                  {
                    label: 'Manage Subscription',
                    icon: (
                      <CreditCard size={MENU_ICON_SIZE} color={menuIconColor} />
                    ),
                    onPress: () => {
                      void handleManageSubscription();
                    },
                  },
                ]
              : []),
          ]}
        />

        <MenuSection
          items={[
            {
              label: 'Delete Account',
              icon: (
                <Trash size={MENU_ICON_SIZE} color={DELETE_ACCOUNT_COLOR} />
              ),
              labelStyle: { color: DELETE_ACCOUNT_COLOR },
              onPress: () => router.push('/delete-account'),
            },
          ]}
        />
      </View>
    </View>
  );
};
