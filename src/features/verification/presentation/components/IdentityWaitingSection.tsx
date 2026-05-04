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
      <BounceLoader colorClassName="bg-text-default" />
      <Text className="text-center font-poppins-semiBold text-title-4 text-text-default">
        Verifying you…
      </Text>
      <Text className="text-center font-lexend-regular text-base text-text-secondary">
        This usually takes a few seconds. We’re waiting for confirmation from
        our verification partner.
      </Text>
    </View>
  );
};
