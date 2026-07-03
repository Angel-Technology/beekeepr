import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Container, IconButton } from '@components';
import { themedColors, useThemedColor } from '@common';
import { ThemeMenuRow } from '../components/ThemeMenuRow';
import { InfoSection } from '../components/InfoSection';

/**
 * User-controllable app settings. Currently just theme preference —
 * everything else the drawer used to expose here (newsletter,
 * marketing, notifications) is either owned by the OS (notifications)
 * or not yet a real product concept. We add rows as those land.
 *
 * The theme picker was moved out of the menu drawer to live here so
 * the drawer stays focused on navigation entry points, not settings.
 */
export const SettingsScreen = () => {
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
