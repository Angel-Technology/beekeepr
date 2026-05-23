import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, Check } from 'lucide-react-native';
import { appImages } from '@assets/images';
import { Button, DetailCard } from '@components';

type CongratsSectionProps = {
  onStartTrial: () => void;
  onEnterPromoCode: () => void;
};

const YellowCheckIcon = () => (
  <View className="rounded-full bg-brand-highlight p-1.5">
    <Check size={10} color="#000000" strokeWidth={3} />
  </View>
);

export const CongratsSection = ({
  onStartTrial,
  onEnterPromoCode,
}: CongratsSectionProps) => {
  return (
    <View className="w-full flex-1 gap-8 pt-6">
      <View className="w-full gap-1 px-2">
        <Text className="font-poppins-semiBold text-title-4 leading-tight text-text-default">
          WooHoo! You&rsquo;re in.
        </Text>
        <Text className="text-text-tertiary font-lexend-regular text-subhead leading-5">
          You can proudly display your Buzz badge on any dating app
          we&rsquo;re partnered with.
        </Text>
      </View>

      <View className="items-center justify-center">
        <Image
          source={appImages.congrats}
          style={{ width: 179.492, height: 188.629 }}
          contentFit="contain"
        />
      </View>

      <DetailCard
        title="What’s included"
        className="gap-4 rounded-5 p-4"
        titleClassName="font-lexend-semiBold text-base leading-6 text-text-default"
        itemsClassName="gap-3 pl-0"
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
          onPress={onStartTrial}
        />
        <Button
          label="Enter promo code"
          className="self-stretch"
          variant="outline"
          onPress={onEnterPromoCode}
        />
      </View>
    </View>
  );
};
