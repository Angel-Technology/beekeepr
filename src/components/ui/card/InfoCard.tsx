import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

type InfoCardTone = 'neutral' | 'critical';

type InfoCardProps = {
  title: string;
  /**
   * Optional leading visual rendered to the left of the title — typically
   * an alert icon for `critical` cards. Caller owns the wrapper styling
   * (border, padding, size).
   */
  icon?: ReactNode;
  /**
   * Caller-defined body — bullets, paragraphs, or any other JSX. Vertical
   * spacing inside the body is the caller's responsibility (wrap children
   * in a `<View gap-2>` if you want a gap between siblings).
   */
  children: ReactNode;
  /**
   * Optional secondary action shown as a small tinted pill in the header
   * row, opposite the title. Both `actionLabel` and `onPressAction` must
   * be provided for the pill to render.
   */
  actionLabel?: string;
  onPressAction?: () => void;
  /**
   * Surface color of the card.
   * - `neutral` (default): low-emphasis weak surface, for helper content.
   * - `critical`: soft red tint for destructive / "next steps" messaging
   *   on denied or error states.
   */
  tone?: InfoCardTone;
  /**
   * Layout overrides (padding, gap, radius, custom bg). Applied after the
   * tone-driven surface class so `className` always wins.
   */
  className?: string;
  titleClassName?: string;
  actionLabelClassName?: string;
};

// Surface kept separate from layout so callers pick a variant without
// fighting NativeWind precedence on conflicting `bg-` utilities. Same
// pattern as `Card`, `Pill`, and `CompactButton`.
const SURFACE_BY_TONE: Record<InfoCardTone, string> = {
  neutral: 'bg-bg-weak',
  // Inline rgba until the design system ships a true `bg-bg-criticalSubtle`
  // — the existing token of that name is actually black/8, not red/8.
  critical: 'bg-[rgba(255,0,0,0.08)]',
};

export const InfoCard = ({
  title,
  icon,
  children,
  actionLabel,
  onPressAction,
  tone = 'neutral',
  className,
  titleClassName,
  actionLabelClassName,
}: InfoCardProps) => {
  const hasAction = Boolean(actionLabel && onPressAction);

  return (
    <View
      className={clsx(
        'w-full gap-3 self-stretch rounded-5 p-4',
        SURFACE_BY_TONE[tone],
        className,
      )}
    >
      <View className="w-full flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-start gap-3">
          {icon}
          <Text
            className={clsx(
              'flex-1 font-poppins-semiBold text-lg text-text-secondary',
              titleClassName,
            )}
          >
            {title}
          </Text>
        </View>
        {hasAction ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onPressAction}
            className="rounded-round bg-bg-mutedSubtle px-3 py-1.5"
          >
            <Text
              className={clsx(
                'font-lexend-semiBold text-base text-text-secondary',
                actionLabelClassName,
              )}
            >
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
};
