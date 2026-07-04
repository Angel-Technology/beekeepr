import { Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, Check } from 'lucide-react-native';
import { Button, Card, DetailCard, VerificationStatusPill } from '@components';
import { themedColors, useThemedColor } from '@common';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';
import LineBuzz from '@src/assets/svg/LineBuzz';
import { VerificationTrialStepper } from '@features/verification/presentation/components/VerificationTrialStepper';
import { appImages } from '@assets/images';

type BuzzMembershipFlowProps = {
  isPurchasing: boolean;
  reminderLabel: string;
  trialEndLabel: string;
  onStartTrial: () => void;
  onEnterPromoCode: () => void;
};

const YellowCheckIcon = () => (
  <View className="bg-tk-brand-primary mt-[2px] rounded-full p-1.5">
    <Check size={10} color="#000000" strokeWidth={3} />
  </View>
);

export const BuzzMembershipFlow = ({
  isPurchasing,
  reminderLabel,
  trialEndLabel,
  onStartTrial,
  onEnterPromoCode,
}: BuzzMembershipFlowProps) => {
  const { width: windowWidth } = useWindowDimensions();
  // LineBuzz overlays the trophy/headline row — width tracks the screen
  // so the curve sweeps across the text column. 63/282 is the SVG's
  // intrinsic aspect ratio.
  const buzzWidth = Math.max(windowWidth - 200, 180);
  const buzzHeight = (buzzWidth * 63) / 282;
  const lineStroke = useThemedColor(themedColors.border.tertiary);
  const beeColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full gap-7">
      <View className="items-center">
        <VerificationStatusPill
          label="ID verified / No criminal records found"
          size="sm"
        />
      </View>

      <View className="items-center gap-2">
        <Text className="text-tk-text-primary text-center font-poppins-semiBold text-700 leading-tight">
          Congrats, you&rsquo;re in!
        </Text>
        <Text className="text-tk-text-primary text-center font-lexend-regular text-xl">
          30-Day Free Trial
        </Text>
        <Text className="text-tk-text-primary text-center font-poppins-regular text-base">
          $9.99/month
        </Text>
      </View>

      <View className="items-center">
        <Image
          source={appImages.congrats}
          contentFit="contain"
          style={{ width: 200, height: 254 }}
        />
      </View>

      <View className="w-full gap-4">
        <Button
          label="Start 30-day free trial"
          iconRight={<ArrowRight size={24} color="#FFFFFF" strokeWidth={2.2} />}
          loading={isPurchasing}
          onPress={onStartTrial}
        />
        <Button
          label="Enter promo code"
          variant="outline"
          disabled={isPurchasing}
          onPress={onEnterPromoCode}
        />
      </View>

      <DetailCard
        title="What’s included"
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

      <Card className="gap-6 px-4 pb-6 pt-4">
        <View className="w-full">
          <View className="w-full flex-row items-start gap-3">
            <Image
              source={appImages.standoutBee}
              contentFit="contain"
              style={{
                width: 123,
                height: 180.795,
                transform: [{ scaleX: -1 }],
              }}
            />

            <View className="flex-1 flex-col items-center justify-center gap-2 pt-6">
              <View>
                <Text className="text-tk-text-primary text-center font-poppins-semiBold text-700 leading-tight">
                  30-Day
                </Text>
                <Text className="text-tk-text-primary text-center font-poppins-semiBold text-700 leading-tight">
                  Free Trial
                </Text>
              </View>
              <View>
                <Text className="text-tk-text-tertiary text-center font-sourceSans-regular text-base">
                  Try 30 days for free,
                </Text>
                <Text className="text-tk-text-tertiary text-center font-sourceSans-regular text-base">
                  then $9.99/month.
                </Text>
              </View>
            </View>
          </View>

          <View
            className="absolute right-7 top-[160px]"
            style={{ width: buzzWidth, height: buzzHeight }}
            pointerEvents="none"
          >
            <View
              className="w-full"
              style={{ transform: [{ rotate: '4.648deg' }] }}
            >
              <LineBuzz
                width={buzzWidth}
                height={buzzHeight}
                stroke={lineStroke}
              />
            </View>
            <View
              className="absolute -right-[11px] top-0"
              style={{ transform: [{ rotate: '19.052deg' }] }}
            >
              <IntroBeeIcon width={18} height={18} color={beeColor} />
            </View>
          </View>
        </View>

        <View className="w-full gap-6">
          <Text className="text-tk-text-primary font-poppins-semiBold text-xl">
            How your trial works
          </Text>
          <VerificationTrialStepper
            reminderLabel={reminderLabel}
            trialEndLabel={trialEndLabel}
          />
        </View>
        <View className="w-full gap-4">
          <Button
            label="Start 30-day free trial"
            iconRight={
              <ArrowRight size={24} color="#FFFFFF" strokeWidth={2.2} />
            }
            loading={isPurchasing}
            onPress={onStartTrial}
          />
          <Button
            label="Enter promo code"
            variant="outline"
            disabled={isPurchasing}
            onPress={onEnterPromoCode}
          />
        </View>
      </Card>
    </View>
  );
};
