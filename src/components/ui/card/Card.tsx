import clsx from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardTone = 'default' | 'brand' | 'muted';

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  className?: string;
};

// Surface tokens are theme-aware `tk-*` variables. `bg-tk-bg-callout` is the
// brand-tinted surface that resolves to a neutral elevated surface in dark
// mode, so the `brand` card doesn't glow yellow-cream at night.
const SURFACE_BY_TONE: Record<CardTone, string> = {
  default: 'bg-tk-bg-primary',
  brand: 'bg-tk-bg-callout',
  muted: 'bg-tk-bg-secondary',
};

export const Card = ({ children, tone = 'default', className }: CardProps) => {
  return (
    <View
      className={clsx(
        'rounded-5 border border-tk-border-secondary p-lg',
        SURFACE_BY_TONE[tone],
        className,
      )}
    >
      {children}
    </View>
  );
};
