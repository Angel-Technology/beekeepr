import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';

type ExitScreeningModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
};

export const ExitScreeningModal = ({
  visible,
  onCancel,
  onConfirmExit,
}: ExitScreeningModalProps) => {
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onCancel}
      dismissOnBackdropPress
    >
      <View className="gap-4">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-poppins-semiBold text-title-4 text-tk-text-primary">
            Exit screening?
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onCancel}
            className="p-1"
          >
            <X size={24} color={closeIconColor} />
          </TouchableOpacity>
        </View>

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-tk-text-primary">
          You are about to leave the screening process. You can resume any time.
        </Text>

        <View className="h-[1px] bg-tk-border-secondary" />

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-tk-text-primary">
          Are you sure you want to exit?
        </Text>

        <View className="mt-4 w-full flex-row gap-3">
          <View className="flex-1">
            <CompactButton
              label="Yes, exit"
              variant="outline"
              onPress={onConfirmExit}
            />
          </View>
          <View className="flex-1">
            <CompactButton label="Cancel" onPress={onCancel} />
          </View>
        </View>
      </View>
    </BaseModal>
  );
};
