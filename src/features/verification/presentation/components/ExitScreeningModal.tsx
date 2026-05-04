import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, CompactButton } from '@components';

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
  return (
    <BaseModal
      visible={visible}
      onRequestClose={onCancel}
      dismissOnBackdropPress
    >
      <View className="gap-4">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-poppins-semiBold text-title-4 text-text-default">
            Exit screening?
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onCancel}
            className="p-1"
          >
            <X size={24} color="rgba(0,0,0,0.6)" />
          </TouchableOpacity>
        </View>

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-default">
          You are about to leave the screening process. You can resume any time.
        </Text>

        <View className="h-[1px] bg-bg-mutedSubtle" />

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-default">
          Are you sure you want to exit?
        </Text>

        <View className="mt-4 w-full flex-row gap-3">
          <View className="flex-1">
            <CompactButton label="Cancel" onPress={onCancel} />
          </View>
          <View className="flex-1">
            <CompactButton
              label="Yes, exit"
              variant="outline"
              onPress={onConfirmExit}
            />
          </View>
        </View>
      </View>
    </BaseModal>
  );
};
