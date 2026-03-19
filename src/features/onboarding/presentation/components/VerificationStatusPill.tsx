import { Text, View } from 'react-native';
import IntroBeeIcon from '@assets/svg/IntroBeeIcon';

type VerificationStatusPillProps = {
  label: string;
};

export const VerificationStatusPill = ({
  label,
}: VerificationStatusPillProps) => {
  return (
    <View className="flex flex-row items-center justify-center gap-2 rounded-full bg-brand-highlight px-4 py-3">
      <IntroBeeIcon width={15.75} height={13.986} />
      <Text className="font-sourceSans-semiBold text-300 text-text-default">
        {label}
      </Text>
    </View>
  );
};
