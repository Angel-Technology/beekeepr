import Svg, { Path, type SvgProps } from 'react-native-svg';

type SpeechBubbleProps = SvgProps & {
  width?: number;
  height?: number;
};

export default function SpeechBubble({
  width = 175,
  height = 101,
  ...props
}: SpeechBubbleProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 175 101"
      fill="none"
      {...props}
    >
      <Path
        d="M84.3851 3.69072C60.3469 0.256356 40.5029 2.24447 26.3402 7.927C12.1889 13.605 3.914 22.8559 2.32806 33.9666C-0.892602 56.5312 19.7748 87.7034 68.9733 94.7327C91.7673 97.9893 113.083 96.826 129.693 92.3363L130.421 92.1397L131.097 92.4719C141.14 97.4059 148.583 98.905 154.939 98.3622C159.587 97.9652 163.791 96.4638 168.152 94.204C161.082 92.9215 155.359 90.899 151.17 85.4417L149.923 83.8167L151.579 82.6083C156.429 79.0692 160.062 73.0054 161.738 65.8794C163.409 58.7724 163.089 50.7824 160.228 43.549C154.576 29.2549 132.647 10.5859 84.3851 3.69072Z"
        fill="white"
        stroke="black"
        strokeWidth={4}
      />
    </Svg>
  );
}
