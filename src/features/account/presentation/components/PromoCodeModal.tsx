import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { BaseModal, CompactButton, Input } from '@components';
import { themedColors, useThemedColor } from '@common';

type PromoCodeModalProps = {
  visible: boolean;
  code: string;
  error: string | null;
  isRedeeming: boolean;
  canRedeem: boolean;
  onChangeCode: (next: string) => void;
  onRedeem: () => void;
  onClose: () => void;
};

/**
 * Single-input modal for redeeming a promotional code. Per product:
 * no live validation — the server is the source of truth, so we only
 * round-trip on Redeem tap. Server-side errors come back through
 * `useRedeemPromoCode` and render via the `Input` `error` prop so the
 * user sees the rejection inline without dismissing the modal.
 *
 * Dismissable (X button + backdrop press) when not actively redeeming —
 * we don't want to leave the user stuck mid-flight if they want to bail.
 * Once the request is in-flight we lock both paths so the modal closes
 * cleanly on success rather than racing with an unmount.
 */
export const PromoCodeModal = ({
  visible,
  code,
  error,
  isRedeeming,
  canRedeem,
  onChangeCode,
  onRedeem,
  onClose,
}: PromoCodeModalProps) => {
  const closeIconColor = useThemedColor(themedColors.text.secondary);

  return (
    <BaseModal
      visible={visible}
      contentClassName="max-w-[360px] rounded-4 bg-tk-bg-elevated-primary p-6 gap-4"
      onRequestClose={isRedeeming ? undefined : onClose}
      dismissOnBackdropPress={!isRedeeming}
    >
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-poppins-semiBold text-xl leading-tight text-tk-text-primary">
          Enter promo code
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close"
          disabled={isRedeeming}
          onPress={onClose}
          className="p-1"
        >
          <X size={24} color={closeIconColor} />
        </TouchableOpacity>
      </View>

      <Text className="font-lexend-regular text-base leading-6 text-tk-text-secondary">
        Have a code? Drop it in below to unlock free membership time.
      </Text>

      <View className="w-full gap-4 rounded-5 bg-tk-bg-secondary p-6">
        <Input
          label="Promo code"
          value={code}
          onChangeText={onChangeCode}
          placeholder="e.g. WELCOME123"
          autoCapitalize="characters"
          autoCorrect={false}
          error={error ?? undefined}
          disabled={isRedeeming}
          onSubmitEditing={onRedeem}
        />
      </View>

      <CompactButton
        label="Redeem"
        className="self-stretch"
        loading={isRedeeming}
        disabled={!canRedeem}
        onPress={onRedeem}
      />
    </BaseModal>
  );
};
