import { Text, View } from 'react-native';
import { InfoCard } from '@components';

type PrivacyComplianceCardProps = {
  bullets: readonly string[];
  onPressMoreInfo: () => void;
};

export const PrivacyComplianceCard = ({
  bullets,
  onPressMoreInfo,
}: PrivacyComplianceCardProps) => {
  return (
    <InfoCard
      title="Privacy and Compliance"
      actionLabel="More info"
      onPressAction={onPressMoreInfo}
    >
      <View className="gap-2 pl-2">
        {bullets.map((bullet) => (
          <View key={bullet} className="flex-row items-start gap-2">
            <Text className="text-200 text-text-secondary">{'•'}</Text>
            <Text className="flex-1 font-lexend-regular text-200 leading-[18px] text-text-secondary">
              {bullet}
            </Text>
          </View>
        ))}
      </View>
    </InfoCard>
  );
};
