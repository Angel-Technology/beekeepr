import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';
import { BaseModal } from './BaseModal';
import { CompactButton } from '../button';

type ConfirmDestructiveModalProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  /**
   * Optional secondary-button copy. Defaults to "Cancel". The cancel
   * button uses the neutral outline variant and routes back through
   * `onCancel`.
   */
  cancelLabel?: string;
  /**
   * When `true`, the primary button shows a loader and the modal can't
   * be dismissed via backdrop / close button. Useful when the mutation
   * actually runs in-modal (rather than fire-and-forget after
   * dismissal).
   */
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Generic confirmation dialog for destructive actions — block, flag,
 * remove-friend, etc. Mirrors `DeleteAccountConfirmModal` but takes
 * title/description/CTA copy as props so a single instance can serve
 * every destructive action in the connection-preview drawer.
 *
 * The primary button uses the `critical` tone so the destructive
 * intent reads at a glance. Confirming fires `onConfirm` then waits
 * for the caller to flip `visible` back to `false`.
 */
export const ConfirmDestructiveModal = ({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDestructiveModalProps) => {
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal
      visible={visible}
      onRequestClose={isConfirming ? undefined : onCancel}
      dismissOnBackdropPress={!isConfirming}
    >
      <View className="gap-4">
        <View className="w-full flex-row items-center justify-between">
          <Text className="text-tk-text-primary font-poppins-semiBold text-title-4">
            {title}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close"
            disabled={isConfirming}
            onPress={onCancel}
            className="p-1"
          >
            <X size={24} color={closeIconColor} />
          </TouchableOpacity>
        </View>

        <Text className="text-tk-text-primary font-lexend-regular text-base">
          {description}
        </Text>

        <View className="mt-2 gap-3">
          <CompactButton
            label={confirmLabel}
            variant="outline"
            loading={isConfirming}
            onPress={onConfirm}
            // CompactButton doesn't have a `tone` like `Button` —
            // `text-tk-alerts-danger` is the same red token `Button`'s
            // `tone="critical" variant="outline"` resolves to. Override
            // here keeps the destructive label red without expanding the
            // shared component's API.
            textClassName="text-tk-alerts-danger"
          />
          <CompactButton
            label={cancelLabel}
            variant="outline"
            disabled={isConfirming}
            onPress={onCancel}
          />
        </View>
      </View>
    </BaseModal>
  );
};
