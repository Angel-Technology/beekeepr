import { Text, View } from 'react-native';
import { ArrowRight, Check } from 'lucide-react-native';
import { Button, DetailCard } from '@components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Congrats from '@src/assets/svg/Congrats';

type CongratsSectionProps = {
  isStartingTrial: boolean;
  onStartTrial: () => void;
  onEnterPromoCode: () => void;
};

const YellowCheckIcon = () => (
  <View className="mt-[2px] rounded-full bg-brand-highlight p-1.5">
    <Check size={10} color="#000000" strokeWidth={3} />
  </View>
);

export const CongratsSection = ({
  isStartingTrial,
  onStartTrial,
  onEnterPromoCode,
}: CongratsSectionProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-full flex-1 gap-8 pt-6"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="w-full gap-1 px-2">
        <Text className="font-poppins-semiBold text-title-3 leading-tight text-text-default">
          Congrats, You&rsquo;re in!
        </Text>
        <Text className="font-lexend-regular text-lg leading-5 text-text-tertiary">
          You can proudly display your Buzz badge on any dating app we&rsquo;re
          partnered with.
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Congrats width={200} height={254} />
      </View>

      <DetailCard
        title="What’s included"
        className="gap-5 rounded-5 p-4"
        titleClassName="font-lexend-semiBold text-base text-text-default"
        itemsClassName="gap-5 flex-start justify-center item-center"
        itemTextClassName="font-lexend-regular text-subhead leading-5 text-text-secondary"
        items={[
          {
            id: 'buzz-badge',

            label:
              'Boost your profile by adding your Buzz Badge to your dating app profile.',
            icon: <YellowCheckIcon />,
          },
          {
            id: 'community',
            label: 'Access to TheBuzz Community.',
            icon: <YellowCheckIcon />,
          },
        ]}
      />

      <View className="mt-auto w-full gap-4">
        <Button
          label="Start 30-day free trial"
          className="self-stretch"
          iconRight={<ArrowRight size={24} color="#FFFFFF" strokeWidth={2.2} />}
          loading={isStartingTrial}
          onPress={onStartTrial}
        />
        <Button
          label="Enter promo code"
          className="self-stretch"
          variant="outline"
          disabled={isStartingTrial}
          onPress={onEnterPromoCode}
        />
      </View>
    </View>
  );
};
