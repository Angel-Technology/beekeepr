import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@common';

type FormCardProps = {
  children: ReactNode;
  className?: string;
};

export const FormCard = ({ children, className }: FormCardProps) => {
  return (
    <View
      className={cn(
        'gap-6 self-stretch rounded-5 border border-tk-border-secondary bg-tk-bg-primary p-6',
        className,
      )}
    >
      {children}
    </View>
  );
};
