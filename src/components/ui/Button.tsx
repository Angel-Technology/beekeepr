import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';
import { BounceLoader } from './BounceLoader';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
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
  loading = false,
  iconLeft,
  iconRight,
  variant = 'solid',
  className,
  textClassName,
}: ButtonProps) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const loaderColorClassName = isOutline
    ? 'bg-text-default'
    : 'bg-text-inverse';

  return (
    <TouchableOpacity
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityRole="button"
      className={clsx(
        'min-h-8 flex-row items-center justify-between self-stretch rounded-round px-lg py-md',
        isOutline
          ? 'border border-action-neutral-border-default bg-bg-default'
          : 'bg-action-neutral-background-solid',
        isDisabled &&
          (isOutline
            ? 'border-none border-border-disabled bg-bg-disabled opacity-60'
            : 'bg-bg-disabled opacity-60'),
        className,
      )}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View className="h-[32px] w-[32px] items-center justify-center">
        {!loading && iconLeft ? iconLeft : null}
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <BounceLoader colorClassName={loaderColorClassName} />
        </View>
      ) : (
        <Text
          className={clsx(
            'flex-1 text-center font-sourceSans-semiBold text-500',
            isOutline
              ? 'text-text-default'
              : 'text-action-neutral-text-onAction',
            isDisabled && 'text-text-disabled',
            textClassName,
          )}
        >
          {label}
        </Text>
      )}
      <View className="h-[32px] w-[32px] items-center justify-center">
        {!loading && iconRight ? iconRight : null}
      </View>
    </TouchableOpacity>
  );
};
