import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from './BounceLoader';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
  className?: string;
  textClassName?: string;
};

export const Button = ({
  label,
  onPress,
  disabled = false,
  loading = false,
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
        'min-h-8 items-center justify-center self-stretch rounded-round px-lg py-md',
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
              'text-center font-sourceSans-semiBold text-600',
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
