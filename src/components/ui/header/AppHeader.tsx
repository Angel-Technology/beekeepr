import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { themedColors, useThemedColor } from '@common';

/**
 * Parse a `#RRGGBB` literal into its `[r, g, b]` channels so we can
 * build rgba() strings for the top-fade gradient at runtime — the
 * LinearGradient stops can't reference CSS variables, so we have to
 * mix the themed background color into them ourselves.
 */
const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
};

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
  const headerBg = useThemedColor(themedColors.bg.primary);
  const [bgR, bgG, bgB] = hexToRgb(headerBg);
  const maskColors = [
    `rgba(${bgR}, ${bgG}, ${bgB}, 1)`,
    `rgba(${bgR}, ${bgG}, ${bgB}, 0.9)`,
    `rgba(${bgR}, ${bgG}, ${bgB}, 0.48)`,
    `rgba(${bgR}, ${bgG}, ${bgB}, 0)`,
  ] as const;

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
          'absolute left-0 right-0 top-0 z-10 bg-tk-bg-primary',
          wrapperClassName,
        )}
        style={[
          {
            paddingTop: topInset,
            backgroundColor: headerBg,
          },
          animatedStyle,
        ]}
      >
        {headerContent}
      </Animated.View>
      {showTopMask ? (
        <LinearGradient
          pointerEvents="none"
          colors={maskColors}
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
