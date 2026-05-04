import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';
import { SquareCheckBoxFilled } from '@src/assets/svg/SquareCheckBoxFilled';
import { SquareCheckboxUnfilled } from '@src/assets/svg/SquareCheckboxUnfilled';

type CustomCheckboxProps = {
  label: string | ReactNode;
  checked: boolean;
  onChange: () => void;
  className?: string;
  labelClassName?: string;
  checkedFill?: string;
  uncheckedStroke?: string;
};

export const CustomCheckbox = ({
  label,
  checked,
  onChange,
  className,
  labelClassName,
  checkedFill,
  uncheckedStroke,
}: CustomCheckboxProps) => {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className={clsx('flex-row items-center gap-3', className)}
      onPress={onChange}
    >
      <View className="h-4 w-4 items-center justify-center">
        {checked ? (
          <SquareCheckBoxFilled width={16} height={16} fill={checkedFill} />
        ) : (
          <SquareCheckboxUnfilled
            width={16}
            height={16}
            stroke={uncheckedStroke}
          />
        )}
      </View>

      {typeof label === 'string' ? (
        <Text
          className={clsx(
            'flex-1 font-sourceSans-regular text-base leading-[20.8px] text-text-default',
            labelClassName,
          )}
        >
          {label}
        </Text>
      ) : (
        <View className="flex-1">{label}</View>
      )}
    </Pressable>
  );
};
