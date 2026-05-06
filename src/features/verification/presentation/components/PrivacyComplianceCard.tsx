import { Text, TouchableOpacity, View } from 'react-native';

type PrivacyComplianceCardProps = {
  bullets: readonly string[];
  onPressMoreInfo: () => void;
};

export const PrivacyComplianceCard = ({
  bullets,
  onPressMoreInfo,
}: PrivacyComplianceCardProps) => {
  return (
    <View className="w-full gap-3 self-stretch rounded-5 bg-bg-weak p-5">
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-poppins-semiBold text-base text-text-secondary">
          Privacy and Compliance
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="More info about privacy and compliance"
          onPress={onPressMoreInfo}
          className="rounded-round bg-bg-mutedSubtle px-3 py-1.5"
        >
          <Text className="font-lexend-semiBold text-200 text-text-secondary">
            More info
          </Text>
        </TouchableOpacity>
      </View>

      <View className="gap-2 pl-2">
        {bullets.map((bullet) => (
          <View key={bullet} className="flex-row items-start gap-2">
            <Text className="text-200 text-text-secondary">{'\u2022'}</Text>
            <Text className="flex-1 font-lexend-regular text-200 leading-[18px] text-text-secondary">
              {bullet}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
