import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { colors } from '@common/colors';

export const APP_HEADER_HEIGHT = 52;

type AppHeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
  sideClassName?: string;
  centerClassName?: string;
  floating?: boolean;
  topInset?: number;
  animatedStyle?: StyleProp<ViewStyle>;
  wrapperClassName?: string;
  showTopMask?: boolean;
  topMaskHeight?: number;
};

export const AppHeader = ({
  left,
  center,
  right,
  className,
  sideClassName,
  centerClassName,
  floating = false,
  topInset = 0,
  animatedStyle,
  wrapperClassName,
  showTopMask = false,
  topMaskHeight = 0,
}: AppHeaderProps) => {
  const headerContent = (
    <View
      className={clsx(
        'w-full flex-row items-center justify-between px-1',
        className,
      )}
      style={{ minHeight: APP_HEADER_HEIGHT }}
    >
      <View
        className={clsx('min-h-[44px] flex-1 justify-center', sideClassName)}
      >
        {left}
      </View>
      <View
        className={clsx(
          'min-h-[44px] flex-1 items-center justify-center',
          centerClassName,
        )}
      >
        {center}
      </View>
      <View
        className={clsx(
          'min-h-[44px] flex-1 items-end justify-center',
          sideClassName,
        )}
      >
        {right}
      </View>
    </View>
  );

  const staticHeaderContent =
    topInset > 0 ? (
      <View style={{ paddingTop: topInset }}>{headerContent}</View>
    ) : (
      headerContent
    );

  if (!floating) {
    return staticHeaderContent;
  }

  return (
    <>
      <Animated.View
        className={clsx(
          'absolute left-0 right-0 top-0 z-10 bg-bg-default',
          wrapperClassName,
        )}
        style={[
          {
            paddingTop: topInset,
            backgroundColor: colors.bg.default,
          },
          animatedStyle,
        ]}
      >
        {headerContent}
      </Animated.View>
      {showTopMask ? (
        <LinearGradient
          pointerEvents="none"
          colors={[
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 0.9)',
            'rgba(255, 255, 255, 0.48)',
            'rgba(255, 255, 255, 0)',
          ]}
          locations={[0, 0.16, 0.4, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: topMaskHeight,
            zIndex: 8,
          }}
        />
      ) : null}
    </>
  );
};
