import clsx from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <View
      className={clsx(
        'rounded-6 border border-border-subtle bg-white p-lg',
        className,
      )}
    >
      {children}
    </View>
  );
};
