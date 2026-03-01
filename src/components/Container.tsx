import React from 'react';
import type { JSX } from 'react';
import clsx from 'clsx';
import type { ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export default function Container({
  children,
  className,
  style,
  ...props
}: ContainerProps): JSX.Element {
  return (
    <View
      className={clsx(
        'flex-1 flex-col items-start self-stretch px-lg',
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
