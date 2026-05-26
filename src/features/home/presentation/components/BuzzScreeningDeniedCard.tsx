import { Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { InfoCard } from '@components';

type BuzzScreeningDeniedCardProps = {
  onAppealDecision: () => void;
};

const DENIED_PARAGRAPHS = [
  'If your application was not approved based on the results of your criminal background screening, and you feel this is in error, you have 30 days to appeal from the time your application was denied.',
];

export const BuzzScreeningDeniedCard = ({
  onAppealDecision,
}: BuzzScreeningDeniedCardProps) => {
  return (
    <InfoCard
      title=""
      icon={
        <View className="rounded-full border-2 border-text-critical p-2">
          <TriangleAlert size={24} color="#000000" strokeWidth={2} />
        </View>
      }
      actionLabel="Contact Support"
      onPressAction={onAppealDecision}
      tone="critical"
    >
      <Text className="flex-1 font-poppins-semiBold text-lg text-text-secondary">
        We’re sorry, you did not pass TheBuzz screening.
      </Text>
      <View className="gap-4">
        {DENIED_PARAGRAPHS.map((paragraph) => (
          <Text
            key={paragraph}
            className="font-lexend-regular text-base text-text-secondary"
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </InfoCard>
  );
};
