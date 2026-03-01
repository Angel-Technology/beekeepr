import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  textClassName?: string;
};

export function Button({
  label,
  onPress,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  textClassName,
}: ButtonProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      className={clsx(
        'min-h-8 flex-row items-center justify-center gap-3 self-stretch rounded-round bg-action-neutral-background-solid px-lg py-md',
        disabled && 'bg-brand-tertiary',
        className,
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {iconLeft ? <View>{iconLeft}</View> : null}
      <Text
        className={clsx(
          'flex-1 text-center font-sourceSans-semiBold text-500 text-action-neutral-text-onAction',
          disabled && 'text-text-inverse',
          textClassName,
        )}
      >
        {label}
      </Text>
      {iconRight ? <View>{iconRight}</View> : null}
    </TouchableOpacity>
  );
}
