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
      className={clsx(
        'gap-6 self-stretch rounded-5 border border-tk-border-secondary bg-tk-bg-elevated-primary p-6',
        className,
      )}
    >
      {children}
    </View>
  );
};
