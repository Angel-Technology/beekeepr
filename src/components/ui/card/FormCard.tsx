import clsx from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type FormCardProps = {
  children: ReactNode;
  className?: string;
};

export const FormCard = ({ children, className }: FormCardProps) => {
  return (
    <View
      className={clsx('gap-4 self-stretch rounded-5 bg-bg-weak p-6', className)}
    >
      {children}
    </View>
  );
};
