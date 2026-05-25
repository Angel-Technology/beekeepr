import { Text, View } from 'react-native';
import { InfoCard } from '@components';

type NextStepsCardProps = {
  paragraphs: readonly string[];
  onPressAppeal: () => void;
};

export const NextStepsCard = ({
  paragraphs,
  onPressAppeal,
}: NextStepsCardProps) => {
  return (
    <InfoCard
      title="Next steps"
      actionLabel="Contact Support"
      onPressAction={onPressAppeal}
      tone="critical"
    >
      <View className="gap-4">
        {paragraphs.map((paragraph) => (
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
