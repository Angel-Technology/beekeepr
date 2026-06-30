import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, X } from 'lucide-react-native';
import { Button, Container, IconButton, VerticalSpacer } from '@components';
import { themedColors, useThemedColor } from '@common';
import { useVerificationLearnMore } from '../../hooks/useVerificationLearnMore';
import { VerificationTrialStepper } from '../components/VerificationTrialStepper';

const STAND_OUT_BEE = require('@src/assets/images/StandOutBee.png');
// Figma-spec dimensions for the hero bee.
const BEE_WIDTH = 123;
const BEE_HEIGHT = 180.795;

export const VerificationLearnMoreScreen = () => {
  const { reminderLabel, trialEndLabel, handleGetStarted, handleGoBack } =
    useVerificationLearnMore();
  const iconColor = useThemedColor(themedColors.text.primary);
  const onActionIconColor = useThemedColor(themedColors.text.primaryReversed);

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="bg-tk-bg-primary"
    >
      <View className="w-full">
        <View className="w-full flex-row items-start gap-3">
          <Image
            source={STAND_OUT_BEE}
            contentFit="contain"
            style={{
              width: BEE_WIDTH,
              height: BEE_HEIGHT,
              transform: [{ scaleX: -1 }],
            }}
          />

          <View className="flex-1 flex-col items-center justify-center">
            <IconButton
              accessibilityLabel="Close"
              className="-mr-3 -mt-3 self-end border-none bg-transparent"
              icon={<X size={24} strokeWidth={2.4} color={iconColor} />}
              onPress={handleGoBack}
            />

            <View className="flex-1 flex-col items-center gap-2">
              <View>
                <Text className="text-tk-text-primary text-center font-poppins-semiBold text-800 leading-tight">
                  30-Day
                </Text>
                <Text className="text-tk-text-primary text-center font-poppins-semiBold text-800 leading-tight">
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
        </View>
      </View>

      <VerticalSpacer />

      <View className="w-full flex-1 gap-6 rounded-6 p-4">
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
          label="Get started"
          className="self-stretch"
          iconRight={
            <ArrowRight size={22} strokeWidth={2.3} color={onActionIconColor} />
          }
          onPress={handleGetStarted}
        />
      </View>
    </Container>
  );
};
