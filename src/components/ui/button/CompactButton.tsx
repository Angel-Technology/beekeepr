import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

type CompactButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  textClassName?: string;
};

export const CompactButton = ({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  className,
  textClassName,
}: CompactButtonProps) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const loaderColorClassName = isOutline
    ? 'bg-text-default'
    : 'bg-text-inverse';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={clsx(
        'min-h-[44px] flex-row items-center justify-center gap-2 self-stretch rounded-round px-4 py-3',
        isOutline && 'border border-border-default',
        isDisabled
          ? 'bg-bg-disabled'
          : isOutline
            ? 'bg-bg-default'
            : 'bg-text-default',
        className,
      )}
    >
      {iconLeft && !loading ? iconLeft : null}
      {loading ? (
        <BounceLoader colorClassName={loaderColorClassName} />
      ) : (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={clsx(
            'font-lexend-semiBold text-base leading-tight',
            isDisabled
              ? 'text-text-disabled'
              : isOutline
                ? 'text-text-secondary'
                : 'text-text-inverse',
            textClassName,
          )}
        >
          {label}
        </Text>
      )}
      {iconRight && !loading ? iconRight : null}
    </TouchableOpacity>
  );
};
