import clsx from 'clsx';
import { View } from 'react-native';

type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => {
  return (
    <View
      className={clsx('bg-tk-border-tertiary h-px self-stretch', className)}
    />
  );
};
