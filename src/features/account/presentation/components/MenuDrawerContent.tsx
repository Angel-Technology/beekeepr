import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArchiveRestore, CreditCard, LogOut, Trash } from 'lucide-react-native';
import { AppHeader, BrandMark } from '@components';
import { useAuthActions } from '@features/auth';
import { openInAppBrowser } from '@src/lib/browser';
import { useErrorModal } from '@src/lib/error-modal';
import { useRevenueCat } from '@src/lib/revenuecat';
import { environmentConfig } from '@src/lib/config/environment';
import { MenuSection } from './MenuSection';

const DELETE_ACCOUNT_COLOR = '#FF0000';
const MENU_ICON_SIZE = 20;

export const MenuDrawerContent = ({
  navigation,
}: DrawerContentComponentProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();
  const { isPro, isLapsed, restorePurchases, openManageSubscription } =
    useRevenueCat();
  const { showError, showFromError } = useErrorModal();
  const hasSubscriptionHistory = isPro || isLapsed;

  const closeDrawerThen = useCallback(
    (action: () => void) => {
      navigation.closeDrawer();
      action();
    },
    [navigation],
  );

  const openThenCloseDrawer = useCallback(
    (action: () => void) => {
      action();
      navigation.closeDrawer();
    },
    [navigation],
  );

  const handleManageSubscription = useCallback(async () => {
    try {
      await openManageSubscription();
    } catch (error) {
      showFromError(error, 'Unable to open subscription settings');
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
    <View
      className="flex-1"
      style={{
        paddingBottom: insets.bottom + 24,
      }}
    >
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
            Menu
          </Text>
        }
      />
      <View
        className="flex-1 px-6 pt-6"
        style={{
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="gap-5">
          <MenuSection
            items={[
              {
                label: 'My Profile',
                onPress: () =>
                  openThenCloseDrawer(() => router.push('/profile')),
              },
            ]}
          />

          <MenuSection
            items={[
              {
                label: 'Want to be a partner?',
                onPress: () =>
                  openInAppBrowser(environmentConfig.partnershipsURL),
              },
            ]}
          />

          <MenuSection
            items={[
              {
                label: 'Support',
                onPress: () => openInAppBrowser(environmentConfig.supportURL),
              },
              {
                label: 'Privacy Policy',
                onPress: () =>
                  openInAppBrowser(environmentConfig.privacyPolicyURL),
              },
              {
                label: 'Terms of Use',
                onPress: () =>
                  openInAppBrowser(environmentConfig.termsOfUseURL),
              },
            ]}
          />

          <MenuSection
            items={[
              {
                label: 'Logout',
                icon: <LogOut size={MENU_ICON_SIZE} color="#000000" />,
                onPress: () => closeDrawerThen(() => signOut.mutate()),
              },
              {
                label: 'Restore Purchase',
                icon: <ArchiveRestore size={MENU_ICON_SIZE} color="#000000" />,
                onPress: () =>
                  closeDrawerThen(() => {
                    void handleRestorePurchases();
                  }),
              },
              ...(hasSubscriptionHistory
                ? [
                    {
                      label: 'Manage Subscription',
                      icon: (
                        <CreditCard size={MENU_ICON_SIZE} color="#000000" />
                      ),
                      onPress: () =>
                        closeDrawerThen(() => {
                          void handleManageSubscription();
                        }),
                    },
                  ]
                : []),
              {
                label: 'Delete Account',
                icon: (
                  <Trash size={MENU_ICON_SIZE} color={DELETE_ACCOUNT_COLOR} />
                ),
                labelStyle: { color: DELETE_ACCOUNT_COLOR },
                onPress: () =>
                  openThenCloseDrawer(() => router.push('/delete-account')),
              },
            ]}
          />
        </View>
      </View>
      <BrandMark
        linePosition="bottom"
        logoWidth={257.085}
        logoHeight={56.734}
      />
    </View>
  );
};
