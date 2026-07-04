import { Text, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';
import { Divider } from '../divider/Divider';

/**
 * Standing safety disclaimer card surfaced on the Buzz Badge marketing
 * page and inside the profile preview drawer. Copy + structure are
 * fixed (red shield ring + "Safety is not a guarantee!" headline +
 * body + divider + legal fine print) — render it without props.
 */
export const SafetyDisclaimerCard = () => {
  const dangerColor = useThemedColor(themedColors.alerts.danger);
  const textPrimary = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full gap-3 rounded-5 bg-tk-bg-secondary p-4">
      <View className="w-full flex-row items-center gap-3">
        <View
          className="items-center justify-center rounded-round border-2 p-2"
          style={{ borderColor: dangerColor }}
        >
          <ShieldAlert size={24} color={textPrimary} />
        </View>
        <Text className="flex-1 font-lexend-semiBold text-base leading-6 text-tk-text-primary">
          Safety is not a guarantee!
        </Text>
      </View>
      <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-primary">
        <Text className="font-lexend-regular">
          The Buzz Badge is not a guarantee of safety!{' '}
        </Text>
        It’s a meaningful signal from someone who chose to be accountable.
      </Text>
      <Text className="font-lexend-regular text-footnote leading-[18px] text-tk-text-primary">
        Always use discernment and recommended safety practices when meeting
        anyone new.
      </Text>
      <Divider className="my-2" />
      <Text className="font-lexend-regular text-caption leading-4 text-tk-text-secondary">
        BUZZKEEPR™ DOES NOT CLAIM THAT PEOPLE ARE SAFE! We can only find records
        if they exist and we have access to them. If we don’t find records, this
        doesn’t mean they didn’t commit a crime.
      </Text>
    </View>
  );
};
