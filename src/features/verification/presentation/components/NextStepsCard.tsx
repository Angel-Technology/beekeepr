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
      actionLabel="Appeal decision"
      onPressAction={onPressAppeal}
      className="bg-[rgba(255,0,0,0.08)]"
    >
      <View className="gap-2">
        {paragraphs.map((paragraph) => (
          <Text
            key={paragraph}
            className="font-lexend-regular text-footnote leading-[18px] text-text-secondary"
          >
            {paragraph}
          </Text>
        ))}
      </View>
    </InfoCard>
  );
};
