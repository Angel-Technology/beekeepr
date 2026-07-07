import clsx from 'clsx';
import { View } from 'react-native';

import { themedColors, useThemedColor } from '@common';
import AppHeaderLineBuzz from '@src/assets/svg/AppHeaderLineBuzz';
import LogoBuzzkeepr from '@src/assets/svg/LogoBuzzkeepr';

const LINE_HEIGHT = 102;
const LINE_TOP_OFFSET = 16;

type BrandMarkProps = {
  linePosition?: 'top' | 'bottom';
  logoWidth?: number;
  logoHeight?: number;
};

export const BrandMark = ({
  linePosition = 'top',
  logoWidth,
  logoHeight,
}: BrandMarkProps) => {
  const isBottom = linePosition === 'bottom';

  const themedColor = useThemedColor(themedColors.text.primary);

  return (
    <View
      className={clsx(
        'relative items-center justify-center self-stretch',
        isBottom && 'overflow-hidden',
      )}
      style={{ height: LINE_HEIGHT + LINE_TOP_OFFSET }}
    >
      <View className="absolute top-5">
        <AppHeaderLineBuzz color={themedColor} />
      </View>
      <View>
        <LogoBuzzkeepr
          width={logoWidth}
          height={logoHeight}
          color={themedColor}
        />
      </View>
    </View>
  );
};
