import { Text, View } from 'react-native';

type StepBadgeProps = {
  current: number;
  total: number;
};

export const StepBadge = ({ current, total }: StepBadgeProps) => {
  return (
    <View className="self-start rounded-2 bg-brand-secondary px-1.5 py-0.5">
      <Text className="font-lexend-regular text-200 leading-none text-text-default">
        STEP {current} of {total}
      </Text>
    </View>
  );
};
