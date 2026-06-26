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
    <View className="border-tk-brand-primary bg-tk-bg-primary w-full flex-row items-center gap-3 rounded-5 border-2 p-4">
      <View className="border-tk-brand-primary rounded-full border-2 p-3">
        <Bell size={16} color={bellColor} strokeWidth={2.4} />
      </View>
      <Text className="text-tk-text-primary flex-1 font-lexend-semiBold text-base">
        30-Day Free Trial
      </Text>
      <View className="bg-tk-brand-primary rounded-3 px-3 py-[9px]">
        <Text className="font-lexend-regular text-sm text-black">
          {formatDaysLabel(daysRemaining)}
        </Text>
      </View>
    </View>
  );
};
