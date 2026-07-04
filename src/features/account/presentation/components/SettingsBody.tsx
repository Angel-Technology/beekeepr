import { Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Container, IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { InfoSection } from './InfoSection';
import { ThemeMenuRow } from './ThemeMenuRow';

type SettingsBodyProps = {
  /** Back button in the header — parent typically calls `router.back()`. */
  onGoBack: () => void;
};

/**
 * Pure presentation body for the app Settings screen. Renders the app
 * header and the theme-preference picker (`ThemeMenuRow`) inside an
 * `InfoSection`.
 *
 * `ThemeMenuRow` reads its own theme-preference context — that's a
 * theming primitive, not a feature hook, so it stays inside the body.
 * The connected screen (`SettingsScreen`) is a thin wrapper that plugs
 * `router.back()` into `onGoBack`.
 */
export const SettingsBody = ({ onGoBack }: SettingsBodyProps) => {
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
            Settings
          </Text>
        }
      />
      <Container>
        <InfoSection
          title="THEME"
          description="Choose how the app looks. System follows your device's appearance setting."
        >
          <ThemeMenuRow />
        </InfoSection>
      </Container>
    </View>
  );
};
