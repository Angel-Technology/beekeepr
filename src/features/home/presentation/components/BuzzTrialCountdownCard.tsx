import { Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';

type BuzzTrialCountdownCardProps = {
  daysRemaining: number;
};

const URGENT_THRESHOLD_DAYS = 3;

const formatDaysLabel = (days: number): string =>
  `${days} ${days === 1 ? 'day' : 'days'} left`;

export const BuzzTrialCountdownCard = ({
  daysRemaining,
}: BuzzTrialCountdownCardProps) => {
  const isUrgent = daysRemaining <= URGENT_THRESHOLD_DAYS;

  return (
    <View className="w-full flex-row items-center gap-3 rounded-5 bg-brand-secondary p-4">
      <View className="rounded-full border-2 border-brand-highlight px-2 py-2">
        <Bell size={16} color="#000000" strokeWidth={2.4} />
      </View>
      <Text className="flex-1 font-lexend-semiBold text-base text-text-default">
        30-Day Free Trial
      </Text>
      <View
        className={
          isUrgent
            ? 'rounded-3 bg-bg-default px-3 py-[9px]'
            : 'rounded-3 bg-brand-highlight px-3 py-[9px]'
        }
      >
        <Text
          className={
            isUrgent
              ? 'font-lexend-regular text-subhead text-text-critical'
              : 'font-lexend-regular text-subhead text-text-default'
          }
        >
          {formatDaysLabel(daysRemaining)}
        </Text>
      </View>
    </View>
  );
};
