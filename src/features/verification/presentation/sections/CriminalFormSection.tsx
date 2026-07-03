import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { CircleHelp } from 'lucide-react-native';
import { Button, Input, VerticalSpacer } from '@components';
import { themedColors, useThemedColor } from '@common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatePickerField } from '../components/StatePickerField';

type SectionProps = {
  label: string;
  children: ReactNode;
};

const FieldGroup = ({ label, children }: SectionProps) => {
  const helpIconColor = useThemedColor(themedColors.text.tertiary);
  return (
    <View className="w-full">
      <View className="w-full flex-row items-center justify-between px-4 pb-3 pt-6">
        <Text className="text-tk-text-tertiary font-lexend-regular text-200 leading-none">
          {label}
        </Text>
        <CircleHelp size={16} color={helpIconColor} />
      </View>
      <View className="bg-tk-bg-elevated-secondary w-full gap-4 rounded-5 p-6">
        {children}
      </View>
    </View>
  );
};

type CriminalFormSectionProps = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  licenseState: string;
  phoneNumber: string;
  phoneError?: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onChangePhoneNumber: (value: string) => void;
  onChangeLicenseState: (value: string) => void;
  onValidatePhoneNumber: () => void;
  onSubmit: () => void;
};

export const CriminalFormSection = ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  licenseState,
  phoneNumber,
  phoneError,
  isSubmitting,
  canSubmit,
  onChangePhoneNumber,
  onChangeLicenseState,
  onValidatePhoneNumber,
  onSubmit,
}: CriminalFormSectionProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      className="w-full flex-1"
      contentContainerClassName="gap-4 pt-lg"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={100}
    >
      <View className="w-full gap-2">
        <Text className="text-tk-text-primary font-poppins-semiBold text-title-4">
          Find my records
        </Text>
        <Text className="text-tk-text-secondary font-lexend-regular text-base leading-[24px] -tracking-[0.3px]">
          To search for your records, please provide your phone number and tap
          submit.
        </Text>
      </View>

      <FieldGroup label="LEGAL NAME">
        <Input
          label="First name"
          value={firstName}
          onChangeText={() => {}}
          disabled
        />
        <Input
          label="Middle name"
          value={middleName}
          onChangeText={() => {}}
          disabled
        />
        <Input
          label="Last name"
          value={lastName}
          onChangeText={() => {}}
          disabled
        />
      </FieldGroup>

      <FieldGroup label="PHONE & DOB">
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={onChangePhoneNumber}
          onBlur={onValidatePhoneNumber}
          error={phoneError}
          type="phone"
          placeholder="(555) 555-5555"
          autoFocus
          className="bg-tk-bg-primary rounded-3 p-2"
        />
        <Input
          label="Date of Birth (mm/dd/yyyy)"
          value={dateOfBirth}
          onChangeText={() => {}}
          disabled
        />
      </FieldGroup>

      <FieldGroup label="STATE OF RESIDENCE">
        <View className="bg-tk-bg-primary border-tk-border-secondary w-full rounded-3 border p-2">
          <StatePickerField
            value={licenseState}
            onChange={onChangeLicenseState}
          />
        </View>
      </FieldGroup>
      <Button
        label="Submit"
        className="self-stretch"
        loading={isSubmitting}
        disabled={!canSubmit}
        onPress={onSubmit}
      />
      <VerticalSpacer size="lg" />
    </KeyboardAwareScrollView>
  );
};
