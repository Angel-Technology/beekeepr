import { Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

/**
 * Replacement for `ProfilePreviewCard` when the user has set their
 * profile to private. Non-interactive on purpose — the drawer opens via
 * the preview card, so leaving this static is what gates the drawer
 * shut.
 */
export const ProfilePreviewHiddenCard = () => {
  const warningColor = useThemedColor(themedColors.alerts.warning);
  const textColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="bg-tk-bg-primary border-tk-border-secondary h-[76px] w-full flex-row items-center gap-4 rounded-5 border px-5 py-3">
      <View
        className="items-center justify-center rounded-round border-2 pb-[9px] pl-3 pr-3 pt-[7px]"
        style={{ borderColor: warningColor }}
      >
        <AlertTriangle size={24} color={textColor} />
      </View>
      <Text className="text-tk-text-tertiary flex-1 font-lexend-regular text-footnote leading-[18px]">
        <Text className="text-tk-text-primary font-lexend-semiBold">
          No preview available.{' '}
        </Text>
        Your profile is set to private and is not discoverable.
      </Text>
    </View>
  );
};
