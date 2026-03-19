import React from 'react';
import type { JSX } from 'react';
import clsx from 'clsx';
import type { ViewProps, ViewStyle } from 'react-native';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  safeArea?: boolean;
  safeAreaEdges?: Edge[];
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
}

const Container = ({
  children,
  className,
  style,
  safeArea = false,
  safeAreaEdges,
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  ...props
}: ContainerProps): JSX.Element => {
  const containerClassName = clsx(
    'flex-1 flex-col items-start self-stretch px-lg',
    className,
  );

  const content = safeArea ? (
    <SafeAreaView
      className={containerClassName}
      style={style}
      edges={safeAreaEdges}
    >
      {children}
    </SafeAreaView>
  ) : (
    <View className={containerClassName} style={style} {...props}>
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

export default Container;
