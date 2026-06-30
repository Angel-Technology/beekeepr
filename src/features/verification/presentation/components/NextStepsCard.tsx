import { Text, TouchableOpacity, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

type NextStepsCardProps = {
  paragraphs: readonly string[];
  onPressAppeal: () => void;
  /**
   * Bold lead line rendered above the paragraphs (e.g. "We're sorry,
   * you did not pass the Buzz Badge screening."). Optional — omit for
   * the simpler verification-flow variant.
   */
  lead?: string;
  /**
   * Override the header title. Defaults to "Next steps".
   */
  title?: string;
  /**
   * Override the action pill copy. Defaults to "Contact Support".
   */
  actionLabel?: string;
};

/**
 * Denial / "next steps" card surfaced on the Buzz tab when a user
 * fails the criminal screening, and inside the verification denied
 * section. Matches Figma 3649:37915 (light) / 3649:38199 (dark) —
 * themed `bg-primary` surface with a hard red border, a shield-ring
 * icon next to the title, and an outline "Contact Support" pill on
 * the right.
 */
export const NextStepsCard = ({
  paragraphs,
  onPressAppeal,
  lead,
  title = 'Next steps',
  actionLabel = 'Contact Support',
}: NextStepsCardProps) => {
  const dangerColor = useThemedColor(themedColors.alerts.danger);
  const textColor = useThemedColor(themedColors.text.primary);

  return (
    <View
      className="w-full gap-4 rounded-5 border-2 bg-tk-bg-primary p-4"
      style={{ borderColor: dangerColor }}
    >
      <View className="w-full flex-row items-center gap-3">
        <View
          className="items-center justify-center rounded-round border-2 p-3"
          style={{ borderColor: dangerColor }}
        >
          <ShieldAlert size={20} color={textColor} />
        </View>
        <Text className="flex-1 font-poppins-semiBold text-base leading-[1.25] text-tk-text-primary">
          {title}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onPressAppeal}
          activeOpacity={0.6}
          className="flex-row items-center justify-center rounded-round border border-tk-actions-neutral-border-default px-4 py-3"
        >
          <Text className="font-lexend-semiBold text-sm text-tk-text-primary">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full gap-2">
        {lead ? (
          <Text className="font-lexend-semiBold text-base leading-6 text-tk-text-primary">
            {lead}
          </Text>
        ) : null}
        {paragraphs.map((paragraph) => (
          <Text
            key={paragraph}
            className="font-lexend-regular text-footnote leading-[18px] text-tk-text-secondary"
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );
};
