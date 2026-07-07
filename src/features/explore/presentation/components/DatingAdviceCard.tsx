import { Text, View } from 'react-native';
import BuzzBadge from '@src/assets/svg/BuzzBadge';

type DatingAdviceCardProps = {
  title: string;
  statistic: string;
  source: string;
  // First entry is "our advice" headline-style. Subsequent entries
  // render as additional paragraphs under the BuzzBadge crest.
  advice: readonly string[];
};

/**
 * Single dating-advice tile rendered on the explore tab. Visual matches
 * the Figma (border + bg-primary card with title / statistic / source /
 * divider / Buzz Badge crest + advice paragraphs). Themed via `tk-*`
 * tokens so light + dark both look right.
 */
export const DatingAdviceCard = ({
  title,
  statistic,
  source,
  advice,
}: DatingAdviceCardProps) => {
  return (
    <View className="w-full gap-2 rounded-5 border border-tk-border-secondary bg-tk-bg-primary p-4">
      <Text className="font-lexend-semiBold text-base leading-6 text-tk-text-primary">
        {title}
      </Text>

      <View className="w-full gap-2">
        <Text className="font-lexend-regular text-sm leading-5 text-tk-text-secondary">
          {statistic}
        </Text>
        <Text className="font-lexend-regular text-sm leading-5 text-tk-text-secondary">
          {source}
        </Text>

        <View className="h-px w-full bg-tk-border-secondary" />

        <View className="w-full flex-row items-start gap-2">
          <View className="pt-0.5">
            <BuzzBadge width={24} height={28} />
          </View>
          <View className="flex-1 gap-2">
            {advice.map((paragraph, index) => (
              <Text
                key={index}
                className="font-lexend-regular text-sm leading-5 text-tk-text-primary"
              >
                {paragraph}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
