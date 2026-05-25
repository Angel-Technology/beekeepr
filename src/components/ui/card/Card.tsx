import clsx from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardTone = 'default' | 'brand' | 'muted';

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  className?: string;
};

// Surface kept separate from layout so callers can choose a tone without
// fighting NativeWind's class precedence on conflicting `bg-` utilities.
const SURFACE_BY_TONE: Record<CardTone, string> = {
  default: 'bg-white',
  brand: 'bg-brand-lighter',
  muted: 'bg-bg-weak',
};

export const Card = ({ children, tone = 'default', className }: CardProps) => {
  return (
    <View
      className={clsx(
        'border border-border-weak p-lg',
        SURFACE_BY_TONE[tone],
        className,
      )}
    >
      {children}
    </View>
  );
};
