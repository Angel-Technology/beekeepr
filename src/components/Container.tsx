import React from 'react';
import type { JSX } from 'react';
import clsx from 'clsx';
import type { ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  safeArea?: boolean;
  safeAreaEdges?: Edge[];
}

export default function Container({
  children,
  className,
  style,
  safeArea = false,
  safeAreaEdges,
  ...props
}: ContainerProps): JSX.Element {
  if (safeArea) {
    return (
      <SafeAreaView
        className={clsx(
          'flex-1 flex-col items-start self-stretch px-lg',
          className,
        )}
        style={style}
        edges={safeAreaEdges}
      >
        {children}
      </SafeAreaView>
    );
  }

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
