import { Text, TouchableOpacity, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';

type BuzzScreeningDeniedCardProps = {
  onAppealDecision: () => void;
};

export const BuzzScreeningDeniedCard = ({
  onAppealDecision,
}: BuzzScreeningDeniedCardProps) => {
  return (
    <View className="w-full gap-4 rounded-5 bg-[#ffebeb] p-4">
      <View className="w-full flex-row items-start gap-3">
        <View className="rounded-full border-2 border-text-critical p-2">
          <TriangleAlert size={24} color="#000000" strokeWidth={2} />
        </View>
        <Text className="flex-1 font-lexend-semiBold text-base leading-6 text-text-secondary">
          We&rsquo;re sorry, you did not pass TheBuzz screening.
        </Text>
      </View>

      <View className="w-full gap-2">
        <Text className="font-lexend-regular text-footnote leading-[18px] text-text-secondary">
          Your application was not approved based, in part, on the results of
          your background screening.
        </Text>
        <Text className="font-lexend-regular text-footnote leading-[18px] text-text-secondary">
          If you feel this is in error, please tap the button below to resolve
          this decision.
        </Text>
        <Text className="font-lexend-regular text-footnote leading-[18px] text-text-secondary">
          You have 30 days to appeal from the time your application was denied.
        </Text>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Appeal decision"
        onPress={onAppealDecision}
        className="min-h-[24px] flex-row items-center justify-center self-end rounded-full bg-bg-mutedSubtle px-3 py-1.5"
      >
        <Text className="font-lexend-semiBold text-xs text-text-secondary">
          Appeal decision
        </Text>
      </TouchableOpacity>
    </View>
  );
};
