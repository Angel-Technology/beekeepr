import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  variant?: 'solid' | 'outline';
  className?: string;
  textClassName?: string;
};

export const Button = ({
  label,
  onPress,
  disabled = false,
  iconLeft,
  iconRight,
  variant = 'solid',
  className,
  textClassName,
}: ButtonProps) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      accessibilityState={{ disabled }}
      accessibilityRole="button"
      className={clsx(
        'min-h-8 flex-row items-center justify-between self-stretch rounded-round px-lg py-md',
        isOutline
          ? 'border border-action-neutral-border-default bg-bg-default'
          : 'bg-action-neutral-background-solid',
        disabled &&
          (isOutline
            ? 'border-none border-border-disabled bg-bg-disabled opacity-60'
            : 'bg-bg-disabled opacity-60'),
        className,
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="h-[32px] w-[32px] items-center justify-center">
        {iconLeft ? iconLeft : null}
      </View>
      <Text
        className={clsx(
          'flex-1 text-center font-sourceSans-semiBold text-500',
          isOutline ? 'text-text-default' : 'text-action-neutral-text-onAction',
          disabled && 'text-text-disabled',
          textClassName,
        )}
      >
        {label}
      </Text>
      <View className="h-[32px] w-[32px] items-center justify-center">
        {iconRight ? iconRight : null}
      </View>
    </TouchableOpacity>
  );
};
