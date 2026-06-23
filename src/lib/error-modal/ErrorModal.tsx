import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';

type ErrorModalProps = {
  visible: boolean;
  title: string;
  message: string;
  primaryActionLabel?: string;
  onClose: () => void;
};

/**
 * Generic error modal used by the app-wide `useErrorModal` hook. Mirrors
 * the visual language of the existing PaymentErrorModal so failures across
 * features feel consistent.
 */
export const ErrorModal = ({
  visible,
  title,
  message,
  primaryActionLabel = 'Got it',
  onClose,
}: ErrorModalProps) => {
  // Lucide icons take a string `color` prop — resolve to the themed secondary
  // text token so the close glyph flips with light/dark.
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal visible={visible} onRequestClose={onClose} dismissOnBackdropPress>
      <View className="gap-4">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-poppins-semiBold text-title-4 text-tk-text-primary">
            {title}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            className="p-1"
          >
            <X size={24} color={closeIconColor} />
          </TouchableOpacity>
        </View>

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-tk-text-secondary">
          {message}
        </Text>

        <CompactButton
          label={primaryActionLabel}
          className="mt-4 self-stretch"
          onPress={onClose}
        />
      </View>
    </BaseModal>
  );
};
