import { ScrollView, Text, View } from 'react-native';
import { Button } from '@components';
import { NextStepsCard } from '../components/NextStepsCard';
import { PrivacyComplianceCard } from '../components/PrivacyComplianceCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SadBee from '@src/assets/svg/SadBee';

type DeniedSectionProps = {
  onGotIt: () => void;
  onAppealDecision: () => void;
  onMoreInfo: () => void;
};

const NEXT_STEPS_PARAGRAPHS = [
  'Your application was not approved based, in part, on the results of your background screening.',
  'If you feel this is in error, please tap the button below to resolve this decision.',
  'You have 30 days to appeal from the time your application was denied.',
] as const;

const PRIVACY_BULLETS = [
  'This screening is strictly confidential',
  'We will not disclose that you did not pass the Buzz Badge screening or that you even attempted',
] as const;

export const DeniedSection = ({
  onGotIt,
  onAppealDecision,
  onMoreInfo,
}: DeniedSectionProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="w-full flex-1"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <ScrollView
        className="w-full flex-1"
        contentContainerClassName="gap-6 px-2 pb-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-1">
          <Text className="font-poppins-semiBold text-title-3 leading-tight text-tk-text-primary">
            Oh no! Something went wrong.
          </Text>
          <Text className="font-lexend-regular text-lg text-tk-text-tertiary">
            Looks like we weren&rsquo;t able to get you into TheBuzz Community
            at this time.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <SadBee width={203} height={161} />
        </View>

        <NextStepsCard
          paragraphs={NEXT_STEPS_PARAGRAPHS}
          onPressAppeal={onAppealDecision}
        >
          <PrivacyComplianceCard
            bullets={PRIVACY_BULLETS}
            onPressMoreInfo={onMoreInfo}
          />
        </NextStepsCard>
      </ScrollView>

      <View className="w-full px-2 pt-4">
        <Button label="Got it" className="self-stretch" onPress={onGotIt} />
      </View>
    </View>
  );
};
