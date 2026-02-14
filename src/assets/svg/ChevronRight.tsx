import { Colors } from '@/styles/Colors';
import { JSX } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function ChevronRightIcon({
  width = 12,
  height = 16,
  fill = Colors.textPrimary,
}: SvgProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 7 12" fill={fill}>
      <Path
        d="M6.53125 5.46875C6.8125 5.78125 6.8125 6.25 6.53125 6.53125L1.53125 11.5312C1.21875 11.8438 0.75 11.8438 0.46875 11.5312C0.15625 11.25 0.15625 10.7812 0.46875 10.5L4.9375 6.03125L0.46875 1.53125C0.15625 1.25 0.15625 0.78125 0.46875 0.5C0.75 0.1875 1.21875 0.1875 1.5 0.5L6.53125 5.46875Z"
        fill={fill || '#7F53A2'}
      />
    </Svg>
  );
}
