import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
};

const BUTTON_SIZE_STYLES: Record<
  ButtonSize,
  {
    container: string;
    text: string;
  }
> = {
  xs: {
    container: 'min-h-0 px-3 py-2',
    text: 'text-xs',
  },
  sm: {
    container: 'min-h-0 px-4 py-2.5',
    text: 'text-sm',
  },
  md: {
    container: 'min-h-0 px-[16px] py-[12px]',
    text: 'text-base',
  },
  lg: {
    container: 'min-h-8 px-lg py-md',
    text: 'text-600',
  },
  xl: {
    container: 'min-h-[56px] px-lg py-md',
    text: 'text-xl',
  },
  '2xl': {
    container: 'min-h-[64px] px-7 py-4',
    text: 'text-700',
  },
};

export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  size = 'lg',
  className,
  textClassName,
}: ButtonProps) => {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;
  const loaderColorClassName = isOutline
    ? 'bg-text-default'
    : 'bg-text-inverse';
  const sizeStyles = BUTTON_SIZE_STYLES[size];

  return (
    <TouchableOpacity
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityRole="button"
      className={clsx(
        'items-center justify-center self-stretch rounded-round',
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
      <View className="items-center justify-center">
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
    </TouchableOpacity>
  );
};
