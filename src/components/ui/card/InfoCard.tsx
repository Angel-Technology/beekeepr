import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

type InfoCardProps = {
  title: string;
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
   * Overrides the surface (background, padding, gap, radius) — pass any
   * Tailwind utilities here. Defaults to a neutral weak surface.
   */
  className?: string;
  titleClassName?: string;
  actionLabelClassName?: string;
};

export const InfoCard = ({
  title,
  children,
  actionLabel,
  onPressAction,
  className,
  titleClassName,
  actionLabelClassName,
}: InfoCardProps) => {
  const hasAction = Boolean(actionLabel && onPressAction);

  return (
    <View
      className={clsx(
        'w-full gap-3 self-stretch rounded-5 bg-bg-weak p-4',
        className,
      )}
    >
      <View className="w-full flex-row items-center justify-between gap-3">
        <Text
          className={clsx(
            'flex-1 font-poppins-semiBold text-base text-text-secondary',
            titleClassName,
          )}
        >
          {title}
        </Text>
        {hasAction ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={onPressAction}
            className="rounded-round bg-bg-mutedSubtle px-3 py-1.5"
          >
            <Text
              className={clsx(
                'font-lexend-semiBold text-xs text-text-secondary',
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
