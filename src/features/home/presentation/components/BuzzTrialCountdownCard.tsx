import { Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { themedColors, useThemedColor } from '@common';

type BuzzTrialCountdownCardProps = {
  daysRemaining: number;
};

const formatDaysLabel = (days: number): string =>
  `${days} ${days === 1 ? 'day' : 'days'} left`;

export const BuzzTrialCountdownCard = ({
  daysRemaining,
}: BuzzTrialCountdownCardProps) => {
  const bellColor = useThemedColor(themedColors.text.primary);

  return (
    <View className="w-full flex-row items-center gap-3 rounded-5 border-2 border-tk-brand-primary bg-tk-bg-primary p-4">
      <View className="rounded-full border-2 border-tk-brand-primary p-3">
        <Bell size={16} color={bellColor} strokeWidth={2.4} />
      </View>
      <Text className="flex-1 font-lexend-semiBold text-base text-tk-text-primary">
        30-Day Free Trial
      </Text>
      <View className="rounded-3 bg-tk-brand-primary px-3 py-[9px]">
        <Text className="font-lexend-regular text-sm text-black">
          {formatDaysLabel(daysRemaining)}
        </Text>
      </View>
    </View>
  );
};
