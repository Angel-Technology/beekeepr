import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import {
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type NativeSyntheticEvent,
  type TextInputProps,
  type TextInputSubmitEditingEventData,
} from 'react-native';

import { themedColors, useThemedColor } from '@common';

type InputType = 'text' | 'email' | 'phone' | 'numeric' | 'password';

type InputProps = {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: InputType;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
};

const KEYBOARD_BY_TYPE: Record<InputType, KeyboardTypeOptions> = {
  text: 'default',
  email: 'email-address',
  phone: 'phone-pad',
  numeric: 'number-pad',
  password: 'default',
};

export const Input = ({
  value,
  onChangeText,
  label,
  placeholder,
  type = 'text',
  error,
  disabled = false,
  autoFocus = false,
  className,
  inputClassName,
  onBlur,
  onFocus,
  onSubmitEditing,
  leftAccessory,
  rightAccessory,
  autoCapitalize,
  autoCorrect,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const placeholderColor = useThemedColor(themedColors.text.quaternary);

  return (
    <View className={clsx('gap- self-stretch', className)}>
      {label ? (
        <Text className="text-tk-text-secondary font-lexend-regular text-xs">
          {label}
        </Text>
      ) : null}

      <View
        className={clsx(
          'min-h-[44px] flex-row items-center self-stretch bg-transparent',
          hasError && isFocused
            ? 'border-tk-alerts-danger border-b-2'
            : 'border-tk-border-secondary border-b',
          disabled && 'opacity-60',
        )}
      >
        {leftAccessory ? <View className="mr-3">{leftAccessory}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType={KEYBOARD_BY_TYPE[type]}
          autoCapitalize={
            autoCapitalize ?? (type === 'email' ? 'none' : 'sentences')
          }
          autoCorrect={autoCorrect ?? (type !== 'email' && type !== 'password')}
          secureTextEntry={type === 'password'}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onSubmitEditing={onSubmitEditing}
          className={clsx(
            'text-tk-text-primary flex-1 font-lexend-regular text-base leading-tight',
            inputClassName,
          )}
          style={{ letterSpacing: -0.3 }}
        />
        {rightAccessory ? <View className="ml-2">{rightAccessory}</View> : null}
      </View>

      {hasError ? (
        <Text className="text-tk-alerts-danger font-lexend-regular text-sm leading-5">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
