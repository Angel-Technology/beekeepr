import { Text, View } from 'react-native';
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

  return (
    <View
      className="w-full flex-1 gap-7"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="w-full gap-2">
        <StepBadge current={1} total={2} />
        <Text className="font-poppins-semiBold text-title-4 text-text-default">
          Verify your identity
        </Text>
        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
          First we’ll take you to our partner to confirm your identity. They’ll
          ask you to scan your government ID and take a selfie.
        </Text>
      </View>

      <View className="w-full flex-1 items-center justify-center">
        <IllustrationLetsdothis />
      </View>

      <PrivacyComplianceCard
        bullets={PRIVACY_BULLETS}
        onPressMoreInfo={onMoreInfo}
      />

      <View className="mt-auto w-full">
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
