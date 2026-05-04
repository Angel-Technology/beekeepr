import Svg, { Path } from 'react-native-svg';

type SquareCheckBoxFilledProps = {
  width?: number;
  height?: number;
  fill?: string;
};

export const SquareCheckBoxFilled = ({
  width = 16,
  height = 16,
  fill = '#FFBF00',
}: SquareCheckBoxFilledProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z"
        fill={fill}
      />
      <Path
        d="M4.5 8.25L7 10.25L11.5 5.75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
