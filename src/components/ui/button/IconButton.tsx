import type { ReactNode } from 'react';
import clsx from 'clsx';
import { TouchableOpacity } from 'react-native';

type IconButtonProps = {
  icon: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  variant?: 'solid' | 'outline';
  className?: string;
};

export const IconButton = ({
  icon,
  onPress,
  disabled = false,
  accessibilityLabel,
  variant = 'solid',
  className,
}: IconButtonProps) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={clsx(
        'h-[44px] w-[44px] items-center justify-center rounded-full p-3',
        isOutline
          ? 'border border-action-neutral-border-default bg-bg-default'
          : 'bg-action-neutral-background-solid',
        disabled && 'border-action-disabled-border opacity-500',
        className,
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {icon}
    </TouchableOpacity>
  );
};
