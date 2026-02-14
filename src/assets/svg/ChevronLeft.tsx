import { colors } from '@src/common/colors';
import { JSX } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function ChevronLeftIcon({
  width = 12,
  height = 16,
  fill = colors.textPrimary,
}: SvgProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 20" fill="none">
      <Path
        d="M1.42188 8.96875L8.92188 1.46875C9.48438 0.859375 10.4688 0.859375 11.0312 1.46875C11.6406 2.03125 11.6406 3.01562 11.0312 3.57812L4.60938 10L11.0312 16.4688C11.6406 17.0312 11.6406 18.0156 11.0312 18.5781C10.4688 19.1875 9.48438 19.1875 8.92188 18.5781L1.42188 11.0781C0.8125 10.5156 0.8125 9.53125 1.42188 8.96875Z"
        fill={fill}
      />
    </Svg>
  );
}
