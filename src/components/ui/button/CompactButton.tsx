import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

type CompactButtonVariant = 'solid' | 'outline' | 'tinted';

type CompactButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: CompactButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  textClassName?: string;
};

const SURFACE_BY_VARIANT: Record<CompactButtonVariant, string> = {
  solid: 'bg-text-default',
  outline: 'bg-bg-default border border-border-default',
  tinted: 'bg-black/[0.08]',
};

const TEXT_BY_VARIANT: Record<CompactButtonVariant, string> = {
  solid: 'text-text-inverse',
  outline: 'text-text-secondary',
  tinted: 'text-text-secondary',
};

const LOADER_BY_VARIANT: Record<CompactButtonVariant, string> = {
  solid: 'bg-text-inverse',
  outline: 'bg-text-default',
  tinted: 'bg-text-default',
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
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={clsx(
        'min-h-[44px] flex-row items-center justify-center gap-2 self-stretch rounded-round px-4 py-3',
        isDisabled ? 'bg-bg-disabled' : SURFACE_BY_VARIANT[variant],
        className,
      )}
    >
      {iconLeft && !loading ? iconLeft : null}
      {loading ? (
        <BounceLoader colorClassName={LOADER_BY_VARIANT[variant]} />
      ) : (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={clsx(
            'font-lexend-semiBold text-base leading-tight',
            isDisabled ? 'text-text-disabled' : TEXT_BY_VARIANT[variant],
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
