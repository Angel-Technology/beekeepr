import type { JSX } from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

type AppHeaderLineBuzzProps = SvgProps & {
  width?: number | string;
  height?: number | string;
  /**
   * Stroke color. The line is rendered with `strokeOpacity`, so pass a fully
   * opaque hex (e.g. `#000000` in light, `#FFFFFF` in dark) and let the
   * opacity prop take care of subtlety.
   */
  color?: string;
  strokeOpacity?: number | string;
};

export default function AppHeaderLineBuzz({
  width = 393,
  height = 102,
  color = '#000000',
  strokeOpacity = 0.16,
}: AppHeaderLineBuzzProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 393 102" fill="none">
      <Path
        d="M0.500122 82.2916C18.7935 87.9588 39.5001 79.4825 50.3535 69.0366C57.917 61.7571 65.0001 58.5001 72.3991 59.4821C83.6475 60.975 88.1421 68.4905 91.5141 75.1515C93.1952 78.4722 93.9699 80.2557 93.0001 83.0001C92.5187 84.3625 90.5001 87.5001 87.6459 87.8601C84.0288 88.3164 82.0351 86.9635 81.0001 86.0959C78.5001 84.0001 77.659 81.5703 78.0001 78.5001C78.5001 74.0001 80.6801 72.9757 84.0001 71.5001C93.0001 67.5001 114 62.0001 132.276 66.5205C142.818 69.1281 151.091 74.8923 158.5 84.0001C160.99 87.0606 163 90.5001 162.5 94.0001C162 97.5001 159.5 99.8285 156.5 100.5C152.467 101.403 148.261 99.4428 147 96.5001C145.5 93.0001 145.574 90.1467 148 87.5001C153.5 81.5001 163.5 75.7743 178 72.5001C193.5 69.0001 208 68.8193 229 71.5001C249.106 74.0669 280.113 80.9676 299.064 82.2916C320.717 83.8045 329.536 83.0716 341.5 78.5001C350.328 75.1272 358.038 68.8149 360.813 63.5073C365 55.5001 366.334 41.6688 365 35.0001C364.5 32.5001 363.761 30.7088 361 28.5001C358.5 26.5001 357.5 26.0001 353.5 26.0001C350.297 26.0001 348.5 27.4824 347 29.5986C346.229 30.6869 345.641 33.5646 346 35.0001C346.755 38.0124 348.677 40.1758 352 41.0001C356.5 42.1163 359.178 41.7694 362 40.5001C369.256 37.2371 384 22.5001 392.5 0.500122"
        stroke={color}
        strokeOpacity={strokeOpacity}
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </Svg>
  );
}
