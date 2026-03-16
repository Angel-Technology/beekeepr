import { useEffect } from 'react';
import clsx from 'clsx';
import type {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { Text, TextInput, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TriangleAlert } from 'lucide-react-native';

type FloatingLabelInputProps = {
  backgroundColor?: string;
  id: string;
  type: 'text' | 'phone' | 'date';
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  isValid?: boolean;
  errorText?: string;
  options?: string[];
  disabled?: boolean;
  onBlur?: () => void;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
};

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const formatDate = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const FloatingLabelInput = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  isValid = true,
  errorText,
  disabled = false,
  backgroundColor,
  onBlur,
  onSubmitEditing,
}: FloatingLabelInputProps) => {
  const labelPosition = useSharedValue(value ? 1 : 0);

  const handleFocus = () => {
    labelPosition.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    if (!value) {
      labelPosition.value = withTiming(0, { duration: 200 });
    }

    onBlur?.();
  };

  const handleChange = (text: string) => {
    if (type === 'phone') {
      onChange(formatPhoneNumber(text));
      return;
    }

    if (type === 'date') {
      onChange(formatDate(text));
      return;
    }

    onChange(text);
  };

  useEffect(() => {
    labelPosition.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(labelPosition.value, [0, 1], [0, -18]),
        },
      ],
      fontSize: interpolate(labelPosition.value, [0, 1], [16, 12]),
      lineHeight: interpolate(labelPosition.value, [0, 1], [20, 16]),
    };
  });

  return (
    <View
      className={'flex flex-col gap-3 self-stretch'}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {!disabled ? (
        <TextInput
          autoCapitalize={type === 'text' ? 'none' : 'sentences'}
          editable={!disabled}
          keyboardType={
            type === 'phone' || type === 'date' ? 'phone-pad' : 'default'
          }
          nativeID={id}
          onBlur={handleBlur}
          className={clsx(
            'w-full border-b py-5 font-sourceSans-regular text-base',
            isValid
              ? 'border-border-subtle text-text-default'
              : 'border-border-critical text-text-critical',
            disabled && 'text-text-weak',
          )}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onSubmitEditing={onSubmitEditing}
          value={value}
        />
      ) : (
        <Text
          className={clsx(
            'w-full border-b py-5 font-sourceSans-regular text-300 tracking-[-0.03px]',
            isValid
              ? 'border-border-subtle text-text-weak'
              : 'border-border-critical text-text-critical',
          )}
        >
          {value}
        </Text>
      )}

      <Animated.Text
        className={clsx(
          'absolute left-0 top-5 font-sourceSans-regular text-300',
          isValid ? 'text-text-weak' : 'text-text-critical',
        )}
        style={animatedLabelStyle}
      >
        {placeholder}
      </Animated.Text>

      {!isValid && errorText ? (
        <View className="flex flex-row items-center gap-3">
          <TriangleAlert color={'#FF0000'} height={16} width={16} />
          <Text className="font-sourceSans-regular text-200 text-text-critical">
            {errorText}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
