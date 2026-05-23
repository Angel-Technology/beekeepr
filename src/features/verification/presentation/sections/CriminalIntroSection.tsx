import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { appImages } from '@assets/images';
import SpeechBubble from '@assets/svg/SpeechBubble';
import { Button } from '@components';
import { PrivacyComplianceCard } from '../components/PrivacyComplianceCard';
import { StepBadge } from '../components/StepBadge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full flex-1 gap-7"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="w-full gap-2">
        <StepBadge current={2} total={2} />
        <Text className="font-poppins-semiBold text-title-4 text-text-default">
          Criminal record search
        </Text>
        <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
          Now we&rsquo;ll check our criminal database and sex offender registry.
        </Text>
      </View>

      <View className="flex-1 flex-col items-end justify-end gap-7">
        <View className="absolute left-5 top-9 z-10">
          <SpeechBubble width={140} height={94} />
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ transform: [{ rotate: '10deg' }] }}
            pointerEvents="none"
          >
            <Text
              className="font-lexend-bold text-text-default"
              style={{ fontSize: 21, letterSpacing: -0.42 }}
            >
              Let&rsquo;s go!
            </Text>
          </View>
        </View>
        <Image
          source={appImages.investigateBee}
          style={{ width: 229, height: 280 }}
          contentFit="contain"
        />
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
