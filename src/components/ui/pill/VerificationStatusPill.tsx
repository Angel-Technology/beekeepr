import { Text, View } from 'react-native';
import clsx from 'clsx';
import IntroBeeIcon from '@assets/svg/IntroBeeIcon';

type VerificationStatusPillProps = {
  label: string;
  className?: string;
};

export const VerificationStatusPill = ({
  label,
  className,
}: VerificationStatusPillProps) => {
  return (
    <View
      className={clsx(
        'flex flex-row items-center justify-center gap-2 rounded-full bg-brand-highlight px-4 py-3',
        className,
      )}
    >
      <IntroBeeIcon width={15.75} height={13.986} />
      <Text className="font-sourceSans-semiBold text-300 text-text-default">
        {label}
      </Text>
    </View>
  );
};
