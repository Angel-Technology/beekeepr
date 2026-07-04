import { Text, View } from 'react-native';
import {
  ArchiveRestore,
  ChevronLeft,
  CreditCard,
  Trash,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, IconButton, Input } from '@components';
import { themedColors, useThemedColor } from '@common';
import { MenuSection, type MenuItem } from './MenuSection';

const DELETE_ACCOUNT_COLOR = '#FF0000';
const MENU_ICON_SIZE = 20;

type AccountBodyProps = {
  /**
   * Read-only email address shown in the disabled `Input`. Sourced from
   * `useAuthSession` in production; empty string when the session hasn't
   * loaded yet.
   */
  email: string;
  /**
   * Whether the user has (or previously had) a paid subscription. When
   * true, the Manage Subscription row appears; when false, it's hidden
   * because RevenueCat's manage-subscription deep link errors for
   * accounts with no subscription history at all.
   */
  hasSubscriptionHistory: boolean;
  /** Header back button. Parent calls `router.back()`. */
  onGoBack: () => void;
  /** Restore Purchase row tap. Parent fires the RevenueCat restore flow. */
  onRestorePurchases: () => void;
  /** Manage Subscription row tap. Only shown when `hasSubscriptionHistory`. */
  onManageSubscription: () => void;
  /** Delete Account row tap. Parent routes to `/delete-account`. */
  onDeleteAccount: () => void;
};

/**
 * Pure presentation body for the account settings hub. Renders the app
 * header, the read-only email row, the subscription menu (Restore
 * Purchase + optional Manage Subscription), and the destructive Delete
 * Account entry point.
 *
 * Reads no feature hooks — only `useThemedColor` for icon colors and
 * `useSafeAreaInsets` for the header inset. The connected screen
 * (`AccountScreen`) wires the auth session, RevenueCat calls, and the
 * router in and hands them to this body as props / callbacks.
 */
export const AccountBody = ({
  email,
  hasSubscriptionHistory,
  onGoBack,
  onRestorePurchases,
  onManageSubscription,
  onDeleteAccount,
}: AccountBodyProps) => {
  const insets = useSafeAreaInsets();
  const chevronColor = useThemedColor(themedColors.text.primary);
  const menuIconColor = useThemedColor(themedColors.text.primary);

  const subscriptionItems: readonly MenuItem[] = [
    {
      label: 'Restore Purchase',
      icon: <ArchiveRestore size={MENU_ICON_SIZE} color={menuIconColor} />,
      onPress: onRestorePurchases,
    },
    // Only surface Manage Subscription once the user has (or had) a paid
    // plan — RevenueCat's manage-subscription deep link errors for
    // accounts with no subscription history at all.
    ...(hasSubscriptionHistory
      ? [
          {
            label: 'Manage Subscription',
            icon: <CreditCard size={MENU_ICON_SIZE} color={menuIconColor} />,
            onPress: onManageSubscription,
          },
        ]
      : []),
  ];

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
          <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-secondary">
            EMAIL ADDRESS
          </Text>
          <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-secondary">
            This is the email address being used for your login and email
            communication.
          </Text>
        </View>

        <View className="w-full rounded-lg border border-tk-border-secondary p-4">
          <Input
            label="Email address"
            value={email}
            onChangeText={() => {}}
            disabled
          />
        </View>

        <MenuSection items={subscriptionItems} />

        <MenuSection
          items={[
            {
              label: 'Delete Account',
              icon: (
                <Trash size={MENU_ICON_SIZE} color={DELETE_ACCOUNT_COLOR} />
              ),
              labelStyle: { color: DELETE_ACCOUNT_COLOR },
              onPress: onDeleteAccount,
            },
          ]}
        />
      </View>
    </View>
  );
};
