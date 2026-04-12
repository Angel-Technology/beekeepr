import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

type ButtonWithIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type ButtonWithIconProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  variant?: 'solid' | 'outline';
  size?: ButtonWithIconSize;
  className?: string;
  textClassName?: string;
};

const BUTTON_WITH_ICON_SIZE_STYLES: Record<
  ButtonWithIconSize,
  {
    container: string;
    text: string;
    iconSlot: string;
  }
> = {
  xs: {
    container: 'min-h-0 px-3 py-2',
    text: 'text-xs',
    iconSlot: 'h-4 w-4',
  },
  sm: {
    container: 'min-h-0 px-4 py-2.5',
    text: 'text-sm',
    iconSlot: 'h-[18px] w-[18px]',
  },
  md: {
    container: 'min-h-0 px-5 py-3',
    text: 'text-base',
    iconSlot: 'h-5 w-5',
  },
  lg: {
    container: 'min-h-8 px-lg py-md',
    text: 'text-600',
    iconSlot: 'h-6 w-6',
  },
  xl: {
    container: 'min-h-[56px] px-lg py-md',
    text: 'text-xl',
    iconSlot: 'h-7 w-7',
  },
  '2xl': {
    container: 'min-h-[64px] px-7 py-4',
    text: 'text-700',
    iconSlot: 'h-8 w-8',
  },
};

export const ButtonWithIcon = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  variant = 'solid',
  size = 'md',
  className,
  textClassName,
}: ButtonWithIconProps) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const loaderColorClassName = isOutline
    ? 'bg-text-default'
    : 'bg-text-inverse';
  const sizeStyles = BUTTON_WITH_ICON_SIZE_STYLES[size];

  return (
    <TouchableOpacity
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityRole="button"
      className={clsx(
        'flex-row items-center self-stretch rounded-round',
        sizeStyles.container,
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
      {iconLeft ? (
        <View
          className={clsx(sizeStyles.iconSlot, 'items-center justify-center')}
        >
          {!loading ? iconLeft : null}
        </View>
      ) : null}

      <View className="flex-1 items-center justify-center">
        {loading ? (
          <BounceLoader colorClassName={loaderColorClassName} />
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className={clsx(
              'text-center font-sourceSans-semiBold',
              textClassName ? null : sizeStyles.text,
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
      </View>

      {iconRight ? (
        <View
          className={clsx(sizeStyles.iconSlot, 'items-center justify-center')}
        >
          {!loading ? iconRight : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
