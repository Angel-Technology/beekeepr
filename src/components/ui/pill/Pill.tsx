import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';

type PillTone = 'tinted' | 'lime' | 'solid';

type PillProps = {
  label: string;
  tone?: PillTone;
  icon?: ReactNode;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
};

// Tone-driven surface + text colors kept off the className override path so
// callers can pick a variant without fighting NativeWind precedence.
const SURFACE_BY_TONE: Record<PillTone, string> = {
  tinted: 'bg-black/[0.08]',
  lime: 'bg-brand-lime',
  solid: 'bg-text-default',
};

const TEXT_BY_TONE: Record<PillTone, string> = {
  tinted: 'text-text-secondary',
  lime: 'text-text-default',
  solid: 'text-text-inverse',
};

/**
 * Small non-action / low-emphasis pill used for inline status labels such as
 * "Coming soon…" tags. For tappable destinations prefer `Button` /
 * `CompactButton`; this primitive is meant for labels and badges.
 *
 * `onPress` is optional — when omitted the pill renders as a plain View so it
 * stays out of the focus order.
 */
export const Pill = ({
  label,
  tone = 'tinted',
  icon,
  onPress,
  className,
  textClassName,
}: PillProps) => {
  const containerClasses = clsx(
    'min-h-[32px] flex-row items-center justify-center gap-2 self-start rounded-round px-3 py-2',
    SURFACE_BY_TONE[tone],
    className,
  );

  const content = (
    <>
      {icon}
      <Text
        className={clsx(
          'font-lexend-semiBold text-sm leading-none',
          TEXT_BY_TONE[tone],
          textClassName,
        )}
      >
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={containerClasses}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClasses}>{content}</View>;
};
