import { Text, View, useWindowDimensions } from 'react-native';
import { ArrowRight, X } from 'lucide-react-native';
import IllustrationAward from '@src/assets/svg/IllustrationAward';
import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';
import LineBuzz from '@src/assets/svg/LineBuzz';
import { Button, Container, IconButton, VerticalSpacer } from '@components';
import { useVerificationLearnMore } from '../../hooks/useVerificationLearnMore';
import { VerificationTrialStepper } from '../components/VerificationTrialStepper';

export const VerificationLearnMoreScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { reminderLabel, trialEndLabel, handleGetStarted, handleGoBack } =
    useVerificationLearnMore();
  const buzzWidth = Math.max(windowWidth - 130, 200);
  const buzzHeight = (buzzWidth * 63) / 282;

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-bg-default"
    >
      <View className="w-full">
        <View className="w-full flex-row items-start gap-3">
          <IllustrationAward width={123} height={180.795} />

          <View className="flex-1 flex-col items-center justify-center">
            <IconButton
              accessibilityLabel="Close"
              className="-mr-3 -mt-3 self-end border-none bg-transparent"
              icon={<X size={24} strokeWidth={2.4} />}
              onPress={handleGoBack}
            />

            <View className="flex-1 flex-col items-center gap-2">
              <View>
                <Text className="text-center font-poppins-semiBold text-800 leading-tight text-text-default">
                  30-Day
                </Text>
                <Text className="text-center font-poppins-semiBold text-800 leading-tight text-text-default">
                  Free Trial
                </Text>
              </View>
              <View>
                <Text className="text-center font-sourceSans-regular text-base text-text-weak">
                  Try 30 days for free,
                </Text>
                <Text className="text-center font-sourceSans-regular text-base text-text-weak">
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
            style={{ transform: [{ rotate: '4.648deg' }] }}
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

      <View className="w-full flex-1 gap-6 rounded-6 p-4">
        <Text className="font-poppins-semiBold text-xl text-text-default">
          How your trial works
        </Text>

        <VerificationTrialStepper
          reminderLabel={reminderLabel}
          trialEndLabel={trialEndLabel}
        />
      </View>

      <View className="mt-auto w-full">
        <Button
          label="Get started"
          className="self-stretch"
          iconRight={<ArrowRight size={22} strokeWidth={2.3} color="#FFFFFF" />}
          onPress={handleGetStarted}
        />
      </View>
    </Container>
  );
};
