import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { MenuSection } from '../components/MenuSection';

/**
 * Legal hub — the drawer used to stack Privacy Policy / Terms of Use /
 * Child Safety Policy inline with every other setting; splitting them
 * into their own screen keeps the drawer scannable and lines up with
 * the platform convention of a dedicated "Legal" surface.
 *
 * Each row opens the corresponding URL from `environmentConfig` in the
 * in-app browser (same behaviour as when they lived on the drawer, no
 * navigation-away side effect).
 */
export const LegalScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chevronColor = useThemedColor(themedColors.text.primary);

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
            Legal
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
        <MenuSection
          items={[
            {
              label: 'Privacy Policy',
              onPress: () =>
                openInAppBrowser(environmentConfig.privacyPolicyURL),
            },
            {
              label: 'Terms of Use',
              onPress: () => openInAppBrowser(environmentConfig.termsOfUseURL),
            },
            {
              label: 'Child Safety Policy',
              onPress: () =>
                openInAppBrowser(environmentConfig.childrenPrivacyURL),
            },
          ]}
        />
      </View>
    </View>
  );
};
