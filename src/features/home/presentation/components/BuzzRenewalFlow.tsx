import { ArrowRight } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Card, CompactButton, VerificationStatusPill } from '@components';
import { appImages } from '@assets/images';

type BuzzRenewalFlowProps = {
  isPurchasing: boolean;
  onRenew: () => void;
  onEnterPromoCode: () => void;
};

/**
 * Shown to subscribed-then-lapsed users. Apple/Google won't honor a
 * second free trial within the same subscription group, so this flow
 * skips the trial pitch entirely and goes straight to a "Renew" CTA
 * that hits the OS purchase sheet via `useRevenueCat().purchase()`.
 */
export const BuzzRenewalFlow = ({
  isPurchasing,
  onRenew,
  onEnterPromoCode,
}: BuzzRenewalFlowProps) => {
  return (
    <Card className="gap-6">
      <View className="items-center gap-2">
        <Text className="text-center font-poppins-semiBold text-800 text-tk-text-primary">
          Welcome back
        </Text>
      </View>
      <View className="items-center">
        <Image
          source={appImages.congrats}
          contentFit="contain"
          style={{ width: 200, height: 254 }}
        />
      </View>

      <VerificationStatusPill label="ID verified / No criminal records found" />

      <Text className="text-center font-poppins-regular text-base text-tk-text-primary">
        Your membership has lapsed. Renew to rejoin TheBuzz community and keep
        your Buzz Badge visible on your dating apps.
      </Text>
      <Text className="text-center font-poppins-bold text-xl text-tk-text-primary">
        $9.99/month
      </Text>
      <View className="gap-3">
        <CompactButton
          label="Renew membership"
          iconRight={<ArrowRight color="#FFFFFF" size={24} strokeWidth={2.2} />}
          loading={isPurchasing}
          onPress={onRenew}
        />
        <CompactButton
          label="Enter promo code"
          className="self-stretch"
          variant="outline"
          disabled={isPurchasing}
          onPress={onEnterPromoCode}
        />
      </View>
    </Card>
  );
};
