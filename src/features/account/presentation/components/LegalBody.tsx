import { Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { MenuSection } from './MenuSection';

type LegalBodyProps = {
  /** Back button in the header — parent typically calls `router.back()`. */
  onGoBack: () => void;
  /** Row tap → open the Privacy Policy URL in the in-app browser. */
  onOpenPrivacyPolicy: () => void;
  /** Row tap → open the Terms of Use URL in the in-app browser. */
  onOpenTermsOfUse: () => void;
  /** Row tap → open the Child Safety Policy URL in the in-app browser. */
  onOpenChildSafetyPolicy: () => void;
};

/**
 * Pure presentation body for the Legal hub. Renders the app header and a
 * single menu section with three legal links (Privacy Policy, Terms of
 * Use, Child Safety Policy).
 *
 * Reads no feature hooks — only `useThemedColor` for chevron color and
 * `useSafeAreaInsets` for the header inset. The connected screen
 * (`LegalScreen`) wires the callbacks to `router.back()` and
 * `openInAppBrowser(...)` for each URL in `environmentConfig`.
 */
export const LegalBody = ({
  onGoBack,
  onOpenPrivacyPolicy,
  onOpenTermsOfUse,
  onOpenChildSafetyPolicy,
}: LegalBodyProps) => {
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
            onPress={onGoBack}
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
            { label: 'Privacy Policy', onPress: onOpenPrivacyPolicy },
            { label: 'Terms of Use', onPress: onOpenTermsOfUse },
            { label: 'Child Safety Policy', onPress: onOpenChildSafetyPolicy },
          ]}
        />
      </View>
    </View>
  );
};
