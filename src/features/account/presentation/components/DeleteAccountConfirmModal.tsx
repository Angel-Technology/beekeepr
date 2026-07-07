import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, Button } from '@components';
import { themedColors, useThemedColor } from '@common';

type DeleteAccountConfirmModalProps = {
  visible: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Final confirmation dialog before the irreversible `requestAccountDeletion`
 * call fires. The Delete Account button on the screen below opens this modal
 * — actually deactivating the account only happens once the user confirms
 * here.
 */
export const DeleteAccountConfirmModal = ({
  visible,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteAccountConfirmModalProps) => {
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal
      visible={visible}
      onRequestClose={isDeleting ? undefined : onCancel}
      dismissOnBackdropPress={!isDeleting}
    >
      <View className="gap-4">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-poppins-semiBold text-title-4 text-tk-text-primary">
            Delete account?
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            disabled={isDeleting}
            onPress={onCancel}
            className="p-1"
          >
            <X size={24} color={closeIconColor} />
          </TouchableOpacity>
        </View>

        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-tk-text-primary">
          Once you confirm, your account will be deactivated immediately and
          scheduled for deletion. You will have 72 hours to log back in and
          restore it.
        </Text>

        <View className="mt-2 gap-3">
          <Button
            label="Delete Account"
            variant="outline"
            tone="critical"
            loading={isDeleting}
            onPress={onConfirm}
          />
        </View>
      </View>
    </BaseModal>
  );
};
