import { Text, View } from 'react-native';
import { Card } from '@components';

/**
 * Body shown on TheBuzz tab when the user has hit a terminal verification
 * denial — either Persona declined the identity check or Checkr came back
 * with possible matches. Replaces the welcome / active celebration so denied
 * users don't see the same "you're in!" UI as approved users. Billing
 * recovery (cancel / refund) is intentionally left out for now — pending the
 * product call on payment shape.
 */
export const BuzzDeniedFlow = () => {
  return (
    <View className="w-full gap-7">
      <Card className="items-center gap-6 rounded-5">
        <View className="w-full gap-2">
          <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
            We couldn’t approve you
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            We weren’t able to verify your account at this time.
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            If you believe this is a mistake, please reach out to our support
            team.
          </Text>
        </View>
      </Card>
    </View>
  );
};
