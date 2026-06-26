import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ShieldAlert, X } from 'lucide-react-native';
import { BaseModal, CompactButton, CustomCheckbox } from '@components';
import { themedColors, useThemedColor } from '@common';

type BuzzSafetyDisclaimerModalProps = {
  visible: boolean;
  // `shouldPersist` mirrors the "Don't show this to me again" checkbox at
  // the moment of dismissal. Learn more is informational and does not
  // dismiss the modal, so it has no persistence side effect.
  onClose: (shouldPersist: boolean) => void;
};

export const BuzzSafetyDisclaimerModal = ({
  visible,
  onClose,
}: BuzzSafetyDisclaimerModalProps) => {
  // Default to checked so the steady-state behavior matches the "show once"
  // intent — a user who taps Got it! without touching the checkbox never
  // sees the modal again. Unchecking opts them back into next session.
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const closeIconColor = useThemedColor(themedColors.text.secondary);
  const textColor = useThemedColor(themedColors.text.primary);
  // Reversed so the checkmark stays readable against the filled square:
  // white check on black box (light), black check on white box (dark).
  const checkmarkColor = useThemedColor(themedColors.text.primaryReversed);

  const handleClose = () => onClose(dontShowAgain);

  return (
    <BaseModal
      visible={visible}
      onRequestClose={handleClose}
      backdropBlur
      contentClassName="max-w-[361px] rounded-4 bg-tk-bg-primary px-6 pb-6 pt-4 gap-4"
    >
      <View className="w-full flex-row items-center justify-between gap-3 py-2">
        <Text
          numberOfLines={1}
          className="text-tk-text-primary flex-1 font-poppins-semiBold text-xl leading-tight"
        >
          Safety is not a guarantee!
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={handleClose}
          className="p-1"
        >
          <X size={24} color={closeIconColor} />
        </TouchableOpacity>
      </View>

      <View className="w-full gap-7">
        <View className="w-full gap-4">
          <View className="w-full flex-row items-start gap-3">
            <View className="border-tk-alerts-danger items-center justify-center rounded-round border-2 p-2">
              <ShieldAlert size={20} color={textColor} strokeWidth={2.2} />
            </View>
            <Text className="text-tk-text-primary flex-1 font-lexend-regular text-sm leading-5">
              The Buzz Badge is not a guarantee of safety! It&apos;s a
              meaningful signal from someone who chose to be accountable.
            </Text>
          </View>

          <View className="bg-tk-border-secondary h-px w-full" />

          <Text className="text-tk-text-secondary font-lexend-regular text-sm leading-5">
            BUZZKEEPR™ DOES NOT CLAIM THAT PEOPLE ARE SAFE! We can only find
            records if they exist and we have access to them. If we don&apos;t
            find records, this doesn&apos;t mean they didn&apos;t commit a
            crime.
          </Text>

          <Text className="text-tk-text-primary font-lexend-semiBold text-base leading-6">
            Always use discernment and recommended safety practices when meeting
            anyone new.
          </Text>
        </View>

        <View className="w-full gap-4">
          <CustomCheckbox
            checked={dontShowAgain}
            onChange={() => setDontShowAgain((current) => !current)}
            checkedFill={textColor}
            checkmarkStroke={checkmarkColor}
            uncheckedStroke={textColor}
            label={
              <Text className="text-tk-text-primary font-lexend-regular text-sm leading-5">
                Don&apos;t show this to me again
              </Text>
            }
          />

          <View className="w-full flex-row gap-3">
            <CompactButton
              label="Got it!"
              variant="solid"
              className="flex-1"
              onPress={handleClose}
            />
          </View>
        </View>
      </View>
    </BaseModal>
  );
};
