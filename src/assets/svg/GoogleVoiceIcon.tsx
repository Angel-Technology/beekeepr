import type { JSX } from 'react';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

type GoogleVoiceIconProps = {
  width?: number | string;
  height?: number | string;
};

/**
 * Google Voice brand icon (handset with speech bubble) in the official green
 * + blue gradient treatment. Brand identity is fixed — no color prop.
 */
export default function GoogleVoiceIcon({
  width = 20,
  height = 20,
}: GoogleVoiceIconProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Mask
        id="googlevoice_canvas_mask"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x={2}
        y={2}
        width={16}
        height={16}
      >
        <Path d="M2 2H18V18H2V2Z" fill="white" />
      </Mask>
      <G mask="url(#googlevoice_canvas_mask)">
        <Path
          d="M3.26866 5.73094L3.2723 5.7274C3.98339 5.03031 5.12484 5.03458 5.83057 5.74021L7.01648 6.92612C7.58448 7.49422 7.58448 8.41522 7.01648 8.98312L6.58921 9.41049C6.16312 9.83649 6.16312 10.5272 6.58921 10.9533L8.86457 13.2285C9.29057 13.6545 9.9813 13.6545 10.4073 13.2285L10.8346 12.8012C11.4026 12.2332 12.3236 12.2332 12.8916 12.8012L14.2592 14.1689C14.9648 14.8745 14.9691 16.0158 14.2721 16.7269V16.7276L14.2571 16.7422L14.182 16.8173C14.1816 16.8177 14.1811 16.8177 14.1806 16.8173L14.1803 16.8171L14.1799 16.817L14.1795 16.8171L14.1792 16.8173C12.5666 18.3332 10.0301 18.3034 8.45411 16.7274L3.2723 11.5456C1.6963 9.96958 1.66639 7.43312 3.18221 5.82049L3.18244 5.82013L3.18253 5.81972L3.18244 5.8193L3.18221 5.81894L3.18193 5.81857L3.18184 5.81812L3.18193 5.81768L3.18221 5.81731L3.25921 5.74031L3.26866 5.73094Z"
          fill="#00AF57"
        />
        <Path
          d="M3.26866 5.73094L3.2723 5.7274C3.98339 5.03031 5.12484 5.03458 5.83057 5.74021L7.01648 6.92612C7.58448 7.49422 7.58448 8.41522 7.01648 8.98312L6.58921 9.41049C6.16312 9.83649 6.16312 10.5272 6.58921 10.9533L8.86457 13.2285C9.29057 13.6545 9.9813 13.6545 10.4073 13.2285L10.8346 12.8012C11.4026 12.2332 12.3236 12.2332 12.8916 12.8012L14.2592 14.1689C14.9648 14.8745 14.9691 16.0158 14.2721 16.7269V16.7276L14.2571 16.7422L14.182 16.8173C14.1816 16.8177 14.1811 16.8177 14.1806 16.8173L14.1803 16.8171L14.1799 16.817L14.1795 16.8171L14.1792 16.8173C12.5666 18.3332 10.0301 18.3034 8.45411 16.7274L3.2723 11.5456C1.6963 9.96958 1.66639 7.43312 3.18221 5.82049L3.18244 5.82013L3.18253 5.81972L3.18244 5.8193L3.18221 5.81894L3.18193 5.81857L3.18184 5.81812L3.18193 5.81768L3.18221 5.81731L3.25921 5.74031L3.26866 5.73094Z"
          fill="url(#googlevoice_handset_gradient)"
        />
        <Mask
          id="googlevoice_bubble_mask"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x={8}
          y={2}
          width={10}
          height={10}
        >
          <Path
            d="M16.9084 2H9.81747C9.21498 2 8.72656 2.48842 8.72656 3.09091V10.1818C8.72656 10.7843 9.21498 11.2727 9.81747 11.2727H16.9084C17.5109 11.2727 17.9993 10.7843 17.9993 10.1818V3.09091C17.9993 2.48842 17.5109 2 16.9084 2Z"
            fill="#D9D9D9"
          />
        </Mask>
        <G mask="url(#googlevoice_bubble_mask)">
          <Path
            d="M9.99902 18C14.4173 18 17.999 14.4183 17.999 10C17.999 5.58172 14.4173 2 9.99902 2C5.58075 2 1.99902 5.58172 1.99902 10C1.99902 14.4183 5.58075 18 9.99902 18Z"
            fill="url(#googlevoice_bubble_gradient)"
          />
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="googlevoice_handset_gradient"
          x1={6.72684}
          y1={13.4546}
          x2={11.3178}
          y2={8.86367}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#78C9FF" stopOpacity={0} />
          <Stop offset={0.75} stopColor="#78C9FF" />
        </LinearGradient>
        <RadialGradient
          id="googlevoice_bubble_gradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(8.81721 11.2727) scale(9.04545)"
        >
          <Stop offset={0.2} stopColor="#78C9FF" />
          <Stop offset={0.85} stopColor="#60D673" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}
