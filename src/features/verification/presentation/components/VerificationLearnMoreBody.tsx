import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight, X } from 'lucide-react-native';
import { appImages } from '@assets/images';
import { Button, Container, IconButton, VerticalSpacer } from '@components';
import { themedColors, useThemedColor } from '@common';
import { VerificationTrialStepper } from './VerificationTrialStepper';

// Figma-spec dimensions for the hero bee.
const BEE_WIDTH = 123;
const BEE_HEIGHT = 180.795;

type VerificationLearnMoreBodyProps = {
  /**
   * Human-readable "In N days" label showing when we email the trial
   * reminder. Computed by `useVerificationLearnMore` from the trial length
   * minus the reminder lead time.
   */
  reminderLabel: string;
  /**
   * Human-readable long-form date for when the trial ends and billing
   * starts. Computed by `useVerificationLearnMore` as today + 30 days.
   */
  trialEndLabel: string;
  onGetStarted: () => void;
  onGoBack: () => void;
};

/**
 * Pure presentation layer for the "30-Day Free Trial" learn-more screen.
 * Renders the hero bee, trial-explainer copy, the
 * `VerificationTrialStepper` (with reminder + trial-end dates baked in),
 * the "Get started" CTA, and the X close button.
 *
 * Reads no feature hooks — only `useThemedColor` for icon colors, which is
 * a pure theme helper. The connected screen (`VerificationLearnMoreScreen`)
 * wraps this with `useVerificationLearnMore` and passes the computed date
 * labels and navigation callbacks in. Stories render this body directly
 * with stubs — no router or theme provider mocks needed.
 */
export const VerificationLearnMoreBody = ({
  reminderLabel,
  trialEndLabel,
  onGetStarted,
  onGoBack,
}: VerificationLearnMoreBodyProps) => {
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
            source={appImages.standoutBee}
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
              onPress={onGoBack}
            />

            <View className="flex-1 flex-col items-center gap-2">
              <View>
                <Text className="text-center font-poppins-semiBold text-800 leading-tight text-tk-text-primary">
                  30-Day
                </Text>
                <Text className="text-center font-poppins-semiBold text-800 leading-tight text-tk-text-primary">
                  Free Trial
                </Text>
              </View>
              <View>
                <Text className="text-center font-sourceSans-regular text-base text-tk-text-tertiary">
                  Try 30 days for free,
                </Text>
                <Text className="text-center font-sourceSans-regular text-base text-tk-text-tertiary">
                  then $9.99/month.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <VerticalSpacer />

      <View className="w-full flex-1 gap-6 rounded-6 p-4">
        <Text className="font-poppins-semiBold text-xl text-tk-text-primary">
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
          onPress={onGetStarted}
        />
      </View>
    </Container>
  );
};
