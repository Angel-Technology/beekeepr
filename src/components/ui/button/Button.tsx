import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

const ICON_SLOT_SIZE = 32;

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  textClassName?: string;
};

const IconSlot = ({ children }: { children?: ReactNode }) => (
  <View
    style={{ width: ICON_SLOT_SIZE, height: ICON_SLOT_SIZE }}
    className="items-center justify-center"
  >
    {children}
  </View>
);

export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  iconLeft,
  iconRight,
  className,
  textClassName,
}: ButtonProps) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const loaderColorClassName = isOutline
    ? 'bg-text-default'
    : 'bg-text-inverse';
  const hasIcon = Boolean(iconLeft || iconRight);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={clsx(
        'min-h-[56px] flex-row items-center gap-3 self-stretch rounded-round px-4 py-2',
        isOutline && 'border border-border-faint',
        isDisabled
          ? 'bg-bg-disabled'
          : isOutline
            ? 'bg-bg-default'
            : 'bg-text-default',
        className,
      )}
    >
      {hasIcon && !loading ? <IconSlot>{iconLeft}</IconSlot> : null}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <BounceLoader colorClassName={loaderColorClassName} />
        </View>
      ) : (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={clsx(
            'flex-1 text-center font-lexend-semiBold text-base leading-tight',
            isDisabled
              ? 'text-text-disabled'
              : isOutline
                ? 'text-text-default'
                : 'text-text-inverse',
            textClassName,
          )}
        >
          {label}
        </Text>
      )}
      {hasIcon && !loading ? <IconSlot>{iconRight}</IconSlot> : null}
    </TouchableOpacity>
  );
};
