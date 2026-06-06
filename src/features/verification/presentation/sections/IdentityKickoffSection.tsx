import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import IllustrationLetsdothis from '@assets/svg/IllustrationLetsdothis';
import { Button } from '@components';
import { PrivacyComplianceCard } from '../components/PrivacyComplianceCard';
import { StepBadge } from '../components/StepBadge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIVACY_BULLETS = [
  'We only screen age to verify you’re 18+',
  'We do not screen for gender',
  'Buzzkeepr does not retain any biometric data from you',
] as const;

// IllustrationLetsdothis bakes width="345" / viewBox="0 0 345 295" into its
// XML and types width/height as `number`-only, so passing percentages isn't
// an option. We scale it from the window width — budget for the verification
// container's worst-case horizontal padding (Container.px-lg = 24px * 2) so
// the illustration always fits on small Android devices.
const ILLUSTRATION_NATURAL_WIDTH = 345;
const ILLUSTRATION_NATURAL_HEIGHT = 295;
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
  const illustrationWidth = Math.min(
    ILLUSTRATION_NATURAL_WIDTH,
    windowWidth - ILLUSTRATION_HORIZONTAL_BUDGET,
  );
  const illustrationHeight =
    (illustrationWidth * ILLUSTRATION_NATURAL_HEIGHT) /
    ILLUSTRATION_NATURAL_WIDTH;

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
            <Text className="font-poppins-semiBold text-title-4 text-text-default">
              Verify your identity
            </Text>
          </View>

          <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
            First we’ll take you to our partner to confirm your identity.
            They’ll ask you to scan your government ID and take a selfie.
          </Text>
        </View>

        <View className="w-full flex-1 items-center justify-center">
          <IllustrationLetsdothis
            width={illustrationWidth}
            height={illustrationHeight}
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
          iconRight={<ArrowRight size={22} strokeWidth={2.3} color="#FFFFFF" />}
          loading={isStarting}
          onPress={onStart}
        />
      </View>
    </View>
  );
};
