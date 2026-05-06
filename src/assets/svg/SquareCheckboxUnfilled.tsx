import Svg, { Path } from 'react-native-svg';

type SquareCheckboxUnfilledProps = {
  width?: number;
  height?: number;
  stroke?: string;
};

export const SquareCheckboxUnfilled = ({
  width = 16,
  height = 16,
  stroke = 'rgba(0, 0, 0, 0.16)',
}: SquareCheckboxUnfilledProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H12C13.933 0.5 15.5 2.067 15.5 4V12C15.5 13.933 13.933 15.5 12 15.5H4C2.067 15.5 0.5 13.933 0.5 12V4Z"
        stroke={stroke}
      />
    </Svg>
  );
};
