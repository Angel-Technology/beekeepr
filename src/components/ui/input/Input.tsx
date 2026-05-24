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
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
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
  onSubmitEditing,
  rightAccessory,
  autoCapitalize,
  autoCorrect,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View className={clsx('gap-2 self-stretch', className)}>
      {label ? (
        <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
          {label}
        </Text>
      ) : null}

      <View
        className={clsx(
          'min-h-[44px] flex-row items-center self-stretch rounded-round bg-bg-default pl-4 pr-3',
          hasError
            ? 'border-2 border-text-critical'
            : isFocused
              ? 'border-2 border-brand-highlight'
              : 'border border-border-weak',
          disabled && 'opacity-60',
        )}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.3)"
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType={KEYBOARD_BY_TYPE[type]}
          autoCapitalize={
            autoCapitalize ?? (type === 'email' ? 'none' : 'sentences')
          }
          autoCorrect={autoCorrect ?? (type !== 'email' && type !== 'password')}
          secureTextEntry={type === 'password'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onSubmitEditing={onSubmitEditing}
          className={clsx(
            'flex-1 font-lexend-regular text-base leading-tight text-text-default',
            inputClassName,
          )}
          style={{ letterSpacing: -0.3 }}
        />
        {rightAccessory ? <View className="ml-2">{rightAccessory}</View> : null}
      </View>

      {hasError ? (
        <Text className="font-lexend-regular text-sm leading-5 text-text-critical">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
