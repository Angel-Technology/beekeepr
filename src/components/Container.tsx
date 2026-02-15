import React, { JSX } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Container({
  children,
  style,
  ...props
}: ContainerProps): JSX.Element {
  return (
    <View
      className="flex flex-col items-center w-full max-w-[500px] mx-auto pt-xl px-md pb-[56px] overflow-hidden"
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
