import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { AppHeader, IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { useAuthActions } from '@features/auth';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { MenuSection } from './MenuSection';
import LogoBuzzkeepr from '@src/assets/svg/LogoBuzzkeepr';

const MENU_ICON_SIZE = 20;
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

/**
 * Menu drawer content. The drawer is now the primary navigation
 * surface — each row is an entry point into a dedicated screen rather
 * than an inline control. Prefs (theme) live under Settings; account
 * lifecycle (Restore / Manage / Delete) lives under Account; legal
 * lives under Legal. Keeps this list scannable and lets each surface
 * evolve without churning the drawer.
 */
export const MenuDrawerContent = ({
  navigation,
}: DrawerContentComponentProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();
  const menuIconColor = useThemedColor(themedColors.text.primary);
  const settingsIconColor = useThemedColor(themedColors.text.primary);

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

  return (
    <View className="flex-1 bg-tk-bg-primary">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Close menu"
            className="border-none bg-transparent"
            icon={
              <ChevronLeft size={24} strokeWidth={2.2} color={menuIconColor} />
            }
            onPress={() => navigation.closeDrawer()}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-tk-text-primary">
            Menu
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Settings"
            className="border-none bg-transparent"
            icon={
              <SettingsIcon
                size={24}
                strokeWidth={2}
                color={settingsIconColor}
              />
            }
            onPress={() => openThenCloseDrawer(() => router.push('/settings'))}
          />
        }
      />
      <View
        className="flex-1"
        style={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
          gap: 20,
        }}
      >
        <MenuSection
          items={[
            {
              label: 'My Profile',
              onPress: () => openThenCloseDrawer(() => router.push('/profile')),
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
              label: 'Account',
              onPress: () => openThenCloseDrawer(() => router.push('/account')),
            },
            {
              label: 'Support',
              onPress: () => openInAppBrowser(environmentConfig.supportURL),
            },
            {
              label: 'Legal',
              onPress: () => openThenCloseDrawer(() => router.push('/legal')),
            },
          ]}
        />

        <MenuSection
          items={[
            {
              label: 'Logout',
              icon: <LogOut size={MENU_ICON_SIZE} color={menuIconColor} />,
              onPress: () => closeDrawerThen(() => signOut.mutate()),
            },
          ]}
        />

        <View className="mt-auto items-center gap-2 pt-6">
          <LogoBuzzkeepr
            width={257.085}
            height={56.734}
            color={menuIconColor}
          />

          <View className="w-full items-center">
            <Text className="font-lexend-regular text-caption leading-4 text-tk-text-tertiary">
              Version {APP_VERSION}
            </Text>
            <Text className="font-lexend-regular text-caption leading-4 text-tk-text-tertiary">
              Created with integrity.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
