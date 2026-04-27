import type { ReactNode } from 'react';
import { Calendar, ChevronDown, CircleQuestionMark } from 'lucide-react-native';
import { Button, DetailCard, FloatingLabelInput } from '@components';
import { Pressable, Text, View } from 'react-native';
import type {
  BackgroundCheckFormErrors,
  BackgroundCheckFormState,
} from '../../models/buzzFlow.types';

const SectionLabel = ({ label }: { label: string }) => {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-sourceSans-semiBold text-xs uppercase tracking-[0.8px] text-text-secondary">
        {label}
      </Text>
      <CircleQuestionMark color="#8C8C8C" size={15} strokeWidth={1.9} />
    </View>
  );
};

const RecordsInputCard = ({ children }: { children: ReactNode }) => {
  return (
    <View className="rounded-5 border border-border-subtle bg-bg-default px-4 py-1">
      {children}
    </View>
  );
};

type BuzzRecordsFlowProps = {
  errors: BackgroundCheckFormErrors;
  form: BackgroundCheckFormState;
  onChangeField: (field: keyof BackgroundCheckFormState, value: string) => void;
  onOpenDatePicker: () => void;
  onGoBack: () => void;
  onSubmit: () => void;
};

export const BuzzRecordsFlow = ({
  errors,
  form,
  onChangeField,
  onOpenDatePicker,
  onGoBack,
  onSubmit,
}: BuzzRecordsFlowProps) => {
  const isSubmitEnabled = Boolean(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phoneNumber.trim() &&
    form.dateOfBirth.trim() &&
    form.state.trim(),
  );

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="font-poppins-semiBold text-700 text-text-default">
          Find your records
        </Text>
        <Text className="font-sourceSans-regular text-sm leading-5 text-text-secondary">
          Your information must be legal to search for your records, including
          any previous names or aliases.
        </Text>
        <Text className="font-sourceSans-regular text-xs text-text-critical">
          * required fields
        </Text>
      </View>

      <View className="gap-5">
        <SectionLabel label="Enter legal name" />
        <RecordsInputCard>
          <FloatingLabelInput
            id="background-check-first-name"
            type="text"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={(value) => {
              onChangeField('firstName', value);
            }}
            isValid={!errors.firstName}
            errorText={errors.firstName}
          />
          <FloatingLabelInput
            id="background-check-middle-name"
            type="text"
            placeholder="Middle Name"
            value={form.middleName}
            onChange={(value) => {
              onChangeField('middleName', value);
            }}
          />
          <FloatingLabelInput
            id="background-check-last-name"
            type="text"
            placeholder="Last Name"
            required
            value={form.lastName}
            onChange={(value) => {
              onChangeField('lastName', value);
            }}
            isValid={!errors.lastName}
            errorText={errors.lastName}
          />
        </RecordsInputCard>

        <SectionLabel label="Enter phone & dob" />
        <RecordsInputCard>
          <FloatingLabelInput
            id="background-check-phone"
            type="phone"
            placeholder="Phone Number (assigned by your carrier)"
            required
            value={form.phoneNumber}
            onChange={(value) => {
              onChangeField('phoneNumber', value);
            }}
            isValid={!errors.phoneNumber}
            errorText={errors.phoneNumber}
          />
          <Pressable className="relative" onPress={onOpenDatePicker}>
            <FloatingLabelInput
              id="background-check-dob"
              type="date"
              placeholder="Date of Birth (mm/dd/yyyy)"
              required
              value={form.dateOfBirth}
              onChange={(value) => {
                onChangeField('dateOfBirth', value);
              }}
              isValid={!errors.dateOfBirth}
              errorText={errors.dateOfBirth}
              disabled
            />
            <View className="pointer-events-none absolute right-1 top-6">
              <Calendar color="#8C8C8C" size={18} strokeWidth={2} />
            </View>
          </Pressable>
        </RecordsInputCard>

        <SectionLabel label="Select state of residence" />
        <View className="relative rounded-5 border border-border-subtle bg-bg-default px-4 py-1">
          <FloatingLabelInput
            id="background-check-state"
            type="text"
            placeholder="State"
            required
            value={form.state}
            onChange={(value) => {
              onChangeField('state', value);
            }}
            isValid={!errors.state}
            errorText={errors.state}
          />
          <View className="pointer-events-none absolute right-4 top-6">
            <ChevronDown color="#8C8C8C" size={18} strokeWidth={2} />
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          className="flex-1"
          label="Go Back"
          size="lg"
          textClassName="font-sourceSans-semiBold text-600 text-text-default"
          variant="outline"
          onPress={onGoBack}
        />
        <Button
          className="flex-1"
          label="Submit"
          size="lg"
          disabled={!isSubmitEnabled}
          textClassName={
            isSubmitEnabled
              ? 'font-sourceSans-semiBold text-600'
              : 'font-sourceSans-semiBold text-600 text-text-disabled'
          }
          onPress={onSubmit}
        />
      </View>

      <DetailCard
        title="Privacy and Compliance Notice"
        className="bg-bg-surfaceSubtle gap-3 rounded-5 px-4 py-4"
        titleClassName="font-poppins-semiBold text-base text-text-default"
        itemsClassName="gap-3 pl-0"
        items={[
          {
            id: 'privacy-retention',
            icon: null,
            label: (
              <Text className="font-sourceSans-regular text-sm leading-5 text-text-secondary">
                <Text className="font-sourceSans-semiBold text-text-default">
                  We do not retain any information
                </Text>{' '}
                you provide in this form. It is only used to perform the
                necessary background check to find your records. Once the
                screening is complete, your information is not stored.
              </Text>
            ),
          },
          {
            id: 'privacy-fcra',
            icon: null,
            label: (
              <Text className="font-sourceSans-regular text-sm leading-5 text-text-secondary">
                <Text className="font-sourceSans-semiBold text-text-default">
                  Your results are strictly confidential!{' '}
                </Text>{' '}
                To comply with the Fair Credit Reporting Act (FCRA) , we will
                not share any results from this screening with any third
                parties. While we do keep a record of whether you earned a badge
                (in binary form), we do not retain detailed screening results.
              </Text>
            ),
          },
          {
            id: 'privacy-sharing',
            icon: null,
            label: (
              <Text className="font-sourceSans-regular text-sm leading-5 text-text-secondary">
                <Text className="font-sourceSans-semiBold text-text-default">
                  Sharing your badge or screening results is entirely at your
                  discretion.
                </Text>{' '}
                You are not required to share your results, and these results
                should not be used to determine eligibility for access or
                qualification for any features or services on this platform or
                any platform you choose to display your badge on.
              </Text>
            ),
          },
        ]}
      />
    </View>
  );
};
