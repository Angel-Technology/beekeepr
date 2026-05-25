import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

import { BounceLoader } from '../loader/BounceLoader';

const ICON_SLOT_SIZE = 20;

type BuzzButtonProps = {
  label: string;
  iconRight: ReactNode;
  iconLeft?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
};

export const BuzzButton = ({
  label,
  iconLeft,
  iconRight,
  onPress,
  disabled = false,
  loading = false,
  className,
  textClassName,
}: BuzzButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={clsx(
        'min-h-[56px] flex-row items-center justify-center gap-2 rounded-round bg-text-default px-6 py-4',
        isDisabled && 'opacity-60',
        className,
      )}
    >
      {loading ? (
        <BounceLoader colorClassName="bg-text-inverse" />
      ) : (
        <>
          {iconLeft ?? (
            <View style={{ width: ICON_SLOT_SIZE, height: ICON_SLOT_SIZE }} />
          )}
          <Text
            numberOfLines={1}
            className={clsx(
              'flex-1 text-center font-lexend-semiBold text-xl text-text-inverse',
              textClassName,
            )}
          >
            {label}
          </Text>
          {iconRight}
        </>
      )}
    </TouchableOpacity>
  );
};
