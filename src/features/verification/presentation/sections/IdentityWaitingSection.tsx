import { Text, View } from 'react-native';
import { BounceLoader } from '@components';

/**
 * The body shown while we're polling the backend for Persona's webhook to
 * land. No action — the user just waits. The poll typically resolves in
 * 1–10s; if it stretches past ~30s the parent flow swaps in
 * `IdentityTimedOutSection` instead.
 */
export const IdentityWaitingSection = () => {
  return (
    <View className="w-full flex-1 items-center justify-center gap-4 px-lg">
      <BounceLoader />
      <Text className="text-tk-text-primary text-center font-poppins-semiBold text-title-4">
        Verifying you…
      </Text>
      <Text className="text-tk-text-secondary text-center font-lexend-regular text-base">
        This usually takes a few seconds. We’re waiting for confirmation from
        our verification partner.
      </Text>
    </View>
  );
};
