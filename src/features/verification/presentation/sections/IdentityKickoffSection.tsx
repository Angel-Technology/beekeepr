import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { appImages } from '@assets/images';
import { Button } from '@components';
import { themedColors, useThemedColor } from '@common';
import { PrivacyComplianceCard } from '../components/PrivacyComplianceCard';
import { StepBadge } from '../components/StepBadge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIVACY_BULLETS = [
  'We only screen age to verify you’re 18+',
  'We do not screen for gender',
  'Buzzkeepr does not retain any biometric data from you',
] as const;

const ILLUSTRATION_MAX_WIDTH = 345;
const ILLUSTRATION_ASPECT_RATIO = 295 / 345;
const ILLUSTRATION_HORIZONTAL_BUDGET = 48;

type IdentityKickoffSectionProps = {
  isStarting: boolean;
  onStart: () => void;
  onMoreInfo: () => void;
};

export const IdentityKickoffSection = ({
  isStarting,
  onStart,
  onMoreInfo,
}: IdentityKickoffSectionProps) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const onActionIconColor = useThemedColor(themedColors.text.primaryReversed);
  const illustrationWidth = Math.min(
    ILLUSTRATION_MAX_WIDTH,
    windowWidth - ILLUSTRATION_HORIZONTAL_BUDGET,
  );
  const illustrationHeight = illustrationWidth * ILLUSTRATION_ASPECT_RATIO;

  return (
    <View
      className="w-full flex-1"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView
        className="w-full flex-1 pt-6"
        contentContainerClassName="w-full grow gap-7"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
      >
        <View className="w-full gap-2">
          <View className="gap-6">
            <StepBadge current={1} total={2} />
            <Text className="text-tk-text-primary font-poppins-semiBold text-title-4">
              Verify your identity
            </Text>
          </View>

          <Text className="text-tk-text-secondary font-lexend-regular text-base leading-[24px] -tracking-[0.3px]">
            First we’ll take you to our partner to confirm your identity.
            They’ll ask you to scan your government ID and take a selfie.
          </Text>
        </View>

        <View className="w-full flex-1 items-center justify-center">
          <Image
            source={appImages.illustrationLetsdothis}
            contentFit="contain"
            style={{
              width: illustrationWidth,
              height: illustrationHeight,
            }}
          />
        </View>

        <PrivacyComplianceCard
          bullets={PRIVACY_BULLETS}
          onPressMoreInfo={onMoreInfo}
        />
      </ScrollView>

      <View className="w-full pt-4">
        <Button
          label="Start verification"
          className="self-stretch"
          iconRight={
            <ArrowRight size={22} strokeWidth={2.3} color={onActionIconColor} />
          }
          loading={isStarting}
          onPress={onStart}
        />
      </View>
    </View>
  );
};
