import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { Card } from '@components';
import JoinBeeIllustration from '@src/assets/svg/JoinBeeIllustration';
import { useRevenueCat } from '@src/lib/revenuecat';
import { BuzzTrialCountdownCard } from './BuzzTrialCountdownCard';

export const BuzzWelcomeFlow = () => {
  const { isOnTrial, trialDaysRemaining } = useRevenueCat();

  return (
    <View className="w-full gap-7">
      {isOnTrial && trialDaysRemaining !== null ? (
        <BuzzTrialCountdownCard daysRemaining={trialDaysRemaining} />
      ) : null}

      <View className="w-full gap-2">
        <Text className="font-lexend-regular text-sm leading-5 text-text-default">
          Search TheBuzz Community
        </Text>
        <View className="flex-row items-center gap-3 rounded-round border border-border-weak bg-bg-default px-4 py-2.5">
          <Search size={20} color="rgba(0,0,0,0.5)" />
          <Text className="text-text-quaternary font-lexend-regular text-sm">
            Nickname, @name, 123456 (pin)
          </Text>
        </View>
      </View>

      <Card className="items-center gap-6 rounded-5">
        <View className="w-full gap-2">
          <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
            Welcome to TheBuzz Community!
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            Did you meet someone online or IRL?
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            You can find them here, by using the search bar above.
          </Text>
        </View>

        <View className="items-center justify-center">
          <JoinBeeIllustration width={235} height={234} />
        </View>
      </Card>
    </View>
  );
};
