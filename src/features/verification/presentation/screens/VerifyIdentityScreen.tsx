import { Image, Text, View, useWindowDimensions } from 'react-native';
import { ArrowRight, X } from 'lucide-react-native';
import { appImages } from '@assets/images';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';
import LineBuzz from '@src/assets/svg/LineBuzz';
import { Button, Container, IconButton, VerticalSpacer } from '@components';
import { useVerifyIdentityScreen } from '../../hooks/useVerifyIdentityScreen';
import { VerificationTrialStepper } from '../components/VerificationTrialStepper';

export const VerifyIdentityScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const {
    verificationStatusDetails,
    reminderLabel,
    trialEndLabel,
    isPending,
    handlePrimaryAction,
    handleGoBack,
  } = useVerifyIdentityScreen();
  const buzzWidth = Math.max(windowWidth - 130, 200);
  const buzzHeight = (buzzWidth * 63) / 282;

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="gap-5 bg-bg-default py-4"
    >
      <View className="w-full">
        <View className="w-full flex-row items-start gap-3">
          <Image
            source={appImages.illustrationTrial}
            resizeMode="contain"
            style={{ width: 123, height: 180.795 }}
          />

          <View className="flex-1 flex-col items-center justify-center gap-2">
            <IconButton
              accessibilityLabel="Close verification"
              className="-mr-3 -mt-3 self-end border-none bg-transparent"
              icon={<X size={24} strokeWidth={2.4} />}
              onPress={handleGoBack}
            />

            <View className="flex-1 flex-col items-center gap-3">
              <View>
                <Text className="text-center font-poppins-semiBold text-800 text-text-default">
                  7-day
                </Text>
                <Text className="text-center font-poppins-semiBold text-800 text-text-default">
                  Free trial
                </Text>
              </View>
              <View>
                <Text className="text-center font-poppins-regular text-300 text-text-weak">
                  Try 7 days for free,
                </Text>
                <Text className="text-center font-poppins-regular text-300 text-text-weak">
                  then $9.95/month.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          className="absolute right-1 top-[150.891px]"
          style={{ width: buzzWidth, height: buzzHeight }}
        >
          <View
            className="w-full"
            style={{
              transform: [{ rotate: '4.648deg' }],
            }}
          >
            <LineBuzz width={buzzWidth} height={buzzHeight} />
          </View>

          <View
            className="absolute -right-[11px] top-0"
            style={{ transform: [{ rotate: '19.052deg' }] }}
          >
            <IntroBeeIcon width={18} height={18} color="rgba(0, 0, 0, 0.88)" />
          </View>
        </View>
      </View>
      <VerticalSpacer />

      <View className="w-full flex-1 gap-6 p-5">
        <View className="gap-6">
          <Text className="font-poppins-semiBold text-xl text-text-default">
            How your trial works
          </Text>

          <VerificationTrialStepper
            reminderLabel={reminderLabel}
            trialEndLabel={trialEndLabel}
          />
        </View>
      </View>
      <View className="mt-auto w-full gap-5">
        <Button
          label={verificationStatusDetails.ctaLabel}
          className="self-stretch"
          disabled={!verificationStatusDetails.canStart}
          iconRight={<ArrowRight size={22} strokeWidth={2.3} color="#FFFFFF" />}
          loading={isPending}
          onPress={() => {
            void handlePrimaryAction();
          }}
        />

        <Button
          className="self-stretch"
          label="Enter promo code"
          textClassName="font-sourceSans-semiBold text-600"
          variant="outline"
        />
      </View>
    </Container>
  );
};
