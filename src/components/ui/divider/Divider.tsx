import clsx from 'clsx';
import { View } from 'react-native';

type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => {
  return (
    <View
      className={clsx('h-px self-stretch bg-tk-border-tertiary', className)}
    />
  );
};
