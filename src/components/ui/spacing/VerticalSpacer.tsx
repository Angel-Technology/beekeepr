import clsx from 'clsx';
import { View } from 'react-native';

type VerticalSpacerProps = {
  size?: VerticalSpacerSize;
  className?: string;
};

const spacerHeights = {
  xs: 'h-xs',
  sm: 'h-sm',
  md: 'h-md',
  lg: 'h-lg',
  xl: 'h-xl',
  '2xl': 'h-2xl',
  '3xl': 'h-3xl',
} as const;

export type VerticalSpacerSize = keyof typeof spacerHeights;

export const VerticalSpacer = ({
  size = 'lg',
  className,
}: VerticalSpacerProps) => {
  return <View className={clsx('w-full', spacerHeights[size], className)} />;
};
