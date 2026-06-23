import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';

type PaymentErrorModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export const PaymentErrorModal = ({
  visible,
  title,
  message,
  onClose,
}: PaymentErrorModalProps) => {
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onClose}
      dismissOnBackdropPress
    >
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
          label="Got it"
          className="mt-4 self-stretch"
          onPress={onClose}
        />
      </View>
    </BaseModal>
  );
};
