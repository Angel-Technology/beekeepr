import { Platform, Switch as RNSwitch } from 'react-native';

type SwitchProps = {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const TRACK_COLORS = {
  false: '#0000001f',
  true: '#00A93E',
};

export const Switch = ({
  value,
  onChange,
  disabled = false,
  accessibilityLabel,
}: SwitchProps) => (
  <RNSwitch
    value={value}
    onValueChange={onChange}
    disabled={disabled}
    accessibilityLabel={accessibilityLabel}
    trackColor={TRACK_COLORS}
    thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
    ios_backgroundColor={TRACK_COLORS.false}
  />
);
