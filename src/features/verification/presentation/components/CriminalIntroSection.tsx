import { Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import IllustrationLetsdothis from '@assets/svg/IllustrationLetsdothis';
import { Button } from '@components';
import { PrivacyComplianceCard } from './PrivacyComplianceCard';
import { StepBadge } from './StepBadge';

const PRIVACY_BULLETS = [
  'This search is strictly confidential',
  'We do not retain any information you provide for this screening or your results',
] as const;

type CriminalIntroSectionProps = {
  onStartSearch: () => void;
  onMoreInfo: () => void;
};

export const CriminalIntroSection = ({
  onStartSearch,
  onMoreInfo,
}: CriminalIntroSectionProps) => {
  return (
    <View className="w-full flex-1 gap-7">
      <View className="w-full gap-2">
        <StepBadge current={2} total={2} />
        <Text className="font-poppins-semiBold text-title-4 text-text-default">
          Criminal record search
        </Text>
        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
          Now we’ll check our criminal database and sex offender registry.
        </Text>
      </View>

      <View className="w-full flex-1 items-center">
        <IllustrationLetsdothis width={229} height={280} />
      </View>

      <PrivacyComplianceCard
        bullets={PRIVACY_BULLETS}
        onPressMoreInfo={onMoreInfo}
      />

      <View className="mt-auto w-full">
        <Button
          label="Start search"
          className="self-stretch"
          iconRight={<ArrowRight size={22} strokeWidth={2.3} color="#FFFFFF" />}
          onPress={onStartSearch}
        />
      </View>
    </View>
  );
};
