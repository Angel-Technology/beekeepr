import { Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

type DisabledSettingHintProps = {
  /**
   * The setting the user needs to toggle on to unlock the disabled row.
   * Rendered verbatim inside the quoted portion of the hint.
   */
  requiredSetting: string;
};

/**
 * Warning-bordered inline hint rendered in place of a `PrivacyOptionRow`
 * whose behaviour depends on a parent toggle. Copy pattern:
 * "This setting is disabled. Toggle on '<requiredSetting>' to enable."
 *
 * Mirrors the visual shell of `ProfilePreviewHiddenCard` — same themed
 * surface, same warning ring, same font sizes — so the two "disabled
 * state" surfaces feel like one family.
 */
export const DisabledSettingHint = ({
  requiredSetting,
}: DisabledSettingHintProps) => {
  const warningColor = useThemedColor(themedColors.alerts.warning);
  const textColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full flex-row items-center gap-4 rounded-5 border border-tk-border-secondary bg-tk-bg-primary px-3 py-3">
      <View
        className="items-center justify-center rounded-round border-2 pb-[9px] pl-3 pr-3 pt-[7px]"
        style={{ borderColor: warningColor }}
      >
        <TriangleAlert size={16} color={textColor} />
      </View>
      <Text className="flex-1 font-lexend-regular text-footnote leading-[18px] text-tk-text-tertiary">
        <Text className="font-lexend-semiBold text-tk-text-primary">
          This setting is disabled.{' '}
        </Text>
        {`Toggle on “${requiredSetting}” to enable.`}
      </Text>
    </View>
  );
};
