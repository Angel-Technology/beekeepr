import { Text, View } from 'react-native';
import { Button } from '@components';

type IdentityTimedOutSectionProps = {
  onGoHome: () => void;
};

/**
 * The body shown when ~30s have elapsed in the waiting phase without
 * Persona's webhook landing. Soft "we'll email you" copy + a "Back to home"
 * CTA so the user isn't trapped on a perpetual spinner.
 */
export const IdentityTimedOutSection = ({
  onGoHome,
}: IdentityTimedOutSectionProps) => {
  return (
    <View className="w-full flex-1 items-center justify-center gap-6 px-lg">
      <Text className="text-center font-poppins-semiBold text-title-4 text-tk-text-primary">
        This is taking longer than usual
      </Text>
      <Text className="text-center font-lexend-regular text-base text-tk-text-secondary">
        Our verification partner needs a little extra time. We’ll email you when
        your identity is confirmed — you can come back any time.
      </Text>
      <View className="w-full">
        <Button
          label="Back to home"
          className="self-stretch"
          onPress={onGoHome}
        />
      </View>
    </View>
  );
};
