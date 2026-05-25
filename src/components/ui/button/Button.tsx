import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

const ICON_SLOT_SIZE = 32;

type ButtonTone = 'default' | 'critical';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  tone?: ButtonTone;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  textClassName?: string;
};

// Tone-driven text color kept off the className override path so callers don't
// fight NativeWind's class precedence rules when picking a destructive label.
const TONE_TEXT_CLASSNAME: Record<
  ButtonTone,
  { solid: string; outline: string }
> = {
  default: { solid: 'text-text-inverse', outline: 'text-text-default' },
  critical: { solid: 'text-text-inverse', outline: 'text-text-critical' },
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
  tone = 'default',
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
  const toneTextClassName = isOutline
    ? TONE_TEXT_CLASSNAME[tone].outline
    : TONE_TEXT_CLASSNAME[tone].solid;

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
            'flex-1 text-center font-lexend-semiBold text-xl',
            isDisabled ? 'text-text-disabled' : toneTextClassName,
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
