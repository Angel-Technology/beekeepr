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
    <View className="bg-tk-bg-primary border-tk-border-secondary w-full gap-2 rounded-5 border p-4">
      <Text className="text-tk-text-primary font-lexend-semiBold text-base leading-6">
        {title}
      </Text>

      <View className="w-full gap-2">
        <Text className="text-tk-text-secondary font-lexend-regular text-sm leading-5">
          {statistic}
        </Text>
        <Text className="text-tk-text-secondary font-lexend-regular text-sm leading-5">
          {source}
        </Text>

        <View className="bg-tk-border-secondary h-px w-full" />

        <View className="w-full flex-row items-start gap-2">
          <View className="pt-0.5">
            <BuzzBadge width={24} height={28} />
          </View>
          <View className="flex-1 gap-2">
            {advice.map((paragraph, index) => (
              <Text
                key={index}
                className="text-tk-text-primary font-lexend-regular text-sm leading-5"
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
