import { Text, View } from 'react-native';
import { Button } from '@components';

type IdentityDeclinedSectionProps = {
  isStarting: boolean;
  onRetry: () => void;
};

/**
 * The body shown when Persona returned a terminal failure
 * (`Declined` / `Failed` / `Expired`). "Try again" relaunches the SDK via
 * the same `startPersonaVerification` path the kickoff section uses.
 */
export const IdentityDeclinedSection = ({
  isStarting,
  onRetry,
}: IdentityDeclinedSectionProps) => {
  return (
    <View className="w-full flex-1 items-center justify-center gap-4 px-lg">
      <Text className="text-center font-poppins-semiBold text-title-4 text-tk-text-primary">
        We couldn’t verify your identity
      </Text>
      <Text className="text-center font-lexend-regular text-base text-tk-text-secondary">
        Try again to scan your government ID and take a selfie.
      </Text>
      <View className="mt-6 w-full">
        <Button
          label="Try again"
          className="self-stretch"
          loading={isStarting}
          onPress={onRetry}
        />
      </View>
    </View>
  );
};
