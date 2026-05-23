import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { CircleHelp } from 'lucide-react-native';
import { Button, Input } from '@components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SectionProps = {
  label: string;
  children: ReactNode;
};

const FieldGroup = ({ label, children }: SectionProps) => {
  return (
    <View className="w-full">
      <View className="w-full flex-row items-center justify-between px-4 pb-3 pt-6">
        <Text className="text-text-tertiary font-lexend-regular text-200 leading-none">
          {label}
        </Text>
        <CircleHelp size={16} color="rgba(0,0,0,0.5)" />
      </View>
      <View className="w-full gap-4 rounded-5 bg-bg-weak p-6">{children}</View>
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
  onValidatePhoneNumber,
  onSubmit,
}: CriminalFormSectionProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      className="w-full flex-1"
      contentContainerClassName="gap-7"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={100}
    >
      <View className="w-full gap-2">
        <Text className="font-poppins-semiBold text-title-4 text-text-default">
          Find my records
        </Text>
        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
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
          label="Phone Number (assigned by your carrier)"
          value={phoneNumber}
          onChangeText={onChangePhoneNumber}
          onBlur={onValidatePhoneNumber}
          error={phoneError}
          type="phone"
          placeholder="(555) 555-5555"
          autoFocus
        />
        <Input
          label="Date of Birth (mm/dd/yyyy)"
          value={dateOfBirth}
          onChangeText={() => {}}
          disabled
        />
      </FieldGroup>

      <FieldGroup label="STATE OF RESIDENCE">
        <Input
          label="Select State"
          value={licenseState}
          onChangeText={() => {}}
          disabled
        />
      </FieldGroup>
      <Button
        label="Submit"
        className="self-stretch"
        loading={isSubmitting}
        disabled={!canSubmit}
        onPress={onSubmit}
      />
    </KeyboardAwareScrollView>
  );
};
