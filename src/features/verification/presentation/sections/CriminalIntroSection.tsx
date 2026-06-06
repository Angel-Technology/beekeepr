import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
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

// Mirror the kickoff section: scale the investigate-bee illustration from
// the window width with a 48px horizontal padding budget (Container.px-lg
// worst case) so it never clips on small Android devices.
const BEE_NATURAL_WIDTH = 229;
const BEE_NATURAL_HEIGHT = 280;
const BEE_HORIZONTAL_BUDGET = 48;

type CriminalIntroSectionProps = {
  onStartSearch: () => void;
  onMoreInfo: () => void;
};

export const CriminalIntroSection = ({
  onStartSearch,
  onMoreInfo,
}: CriminalIntroSectionProps) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const beeWidth = Math.min(
    BEE_NATURAL_WIDTH,
    windowWidth - BEE_HORIZONTAL_BUDGET,
  );
  const beeHeight = (beeWidth * BEE_NATURAL_HEIGHT) / BEE_NATURAL_WIDTH;

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
            <StepBadge current={2} total={2} />
            <Text className="font-poppins-semiBold text-title-4 text-text-default">
              Criminal record search
            </Text>
          </View>
          <Text className="font-lexend-regular text-base leading-[24px] -tracking-[0.3px] text-text-secondary">
            Now we&rsquo;ll check our criminal database and sex offender
            registry.
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
            style={{ width: beeWidth, height: beeHeight }}
            contentFit="contain"
          />
        </View>

        <PrivacyComplianceCard
          bullets={PRIVACY_BULLETS}
          onPressMoreInfo={onMoreInfo}
        />
      </ScrollView>

      <View className="w-full pt-4">
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
