import { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import {
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
};

const onlyDigits = (s: string) => s.replace(/\D/g, '');

export const OtpInput = ({
  value,
  onChange,
  length = 5,
  autoFocus = false,
  disabled = false,
  className,
}: OtpInputProps) => {
  const refs = useRef<Array<TextInput | null>>([]);

  const digits = useMemo(
    () => Array.from({ length }, (_, i) => value[i] ?? ''),
    [value, length],
  );

  const firstEmpty = digits.findIndex((d) => d === '');
  const activeIndex = firstEmpty === -1 ? length - 1 : firstEmpty;

  useEffect(() => {
    if (autoFocus) {
      refs.current[0]?.focus();
    }
  }, [autoFocus]);

  const writeAt = (index: number, chars: string) => {
    const sanitized = onlyDigits(chars);
    if (!sanitized) {
      // Empty (e.g. backspace cleared current) — clear current cell, stay focused
      const next = [...digits];
      next[index] = '';
      onChange(next.join(''));
      return;
    }
    // Distribute pasted/typed digits starting from `index`
    const next = [...digits];
    let cursor = index;
    for (const ch of sanitized) {
      if (cursor >= length) {
        break;
      }
      next[cursor] = ch;
      cursor += 1;
    }
    onChange(next.join(''));
    // Focus the cell *after* the last written one (or last cell if filled)
    const nextFocus = Math.min(cursor, length - 1);
    refs.current[nextFocus]?.focus();
  };

  const handleChangeText = (text: string, index: number) => {
    if (disabled) {
      return;
    }
    writeAt(index, text);
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (disabled) {
      return;
    }
    if (event.nativeEvent.key !== 'Backspace') {
      return;
    }
    if (digits[index]) {
      // Backspace on a filled cell: onChangeText('') will fire and clear it.
      return;
    }
    if (index === 0) {
      return;
    }
    // Empty cell + backspace: clear previous cell and focus it.
    const next = [...digits];
    next[index - 1] = '';
    onChange(next.join(''));
    refs.current[index - 1]?.focus();
  };

  return (
    <View
      className={clsx(
        'flex-row items-center justify-center gap-4 self-stretch',
        className,
      )}
    >
      {digits.map((digit, index) => {
        const isActive = index === activeIndex;
        return (
          <TextInput
            key={`otp-${index}`}
            ref={(node) => {
              refs.current[index] = node;
            }}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={length}
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            editable={!disabled}
            selectTextOnFocus
            className={clsx(
              'h-[50px] w-[50px] rounded-3 bg-tk-bg-primary text-center font-lexend-regular text-base leading-tight text-tk-text-primary',
              isActive
                ? 'border border-tk-text-primary'
                : 'border border-tk-border-secondary',
              disabled && 'opacity-60',
            )}
            style={{ letterSpacing: -0.3 }}
          />
        );
      })}
    </View>
  );
};
