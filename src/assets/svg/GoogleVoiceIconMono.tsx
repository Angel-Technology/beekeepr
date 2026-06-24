import type { JSX } from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

type GoogleVoiceIconMonoProps = {
  width?: number | string;
  height?: number | string;
  /**
   * Color for the solid-fill paths (handset body + speech-bubble glyph).
   * The white-30% layer underneath stays unchanged for the dimensional
   * highlight Figma calls for.
   */
  color?: string;
};

/**
 * Monochrome Google Voice icon — the empty-state pair to
 * `GoogleVoiceIcon`. Updated to the latest Figma node (3713:186): a
 * white-30% glow underneath the `#4D4D4D` handset + speech-bubble
 * silhouette. The `color` prop replaces the `#4D4D4D` so the icon can
 * read as themed `tk-text-quaternary` in light and dark.
 */
export default function GoogleVoiceIconMono({
  width = 20,
  height = 20,
  color = '#4D4D4D',
}: GoogleVoiceIconMonoProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Mask
        id="googlevoice_mono_canvas_mask"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x={2}
        y={2}
        width={16}
        height={16}
      >
        <Path d="M2 2H18V18H2V2Z" fill="white" />
      </Mask>
      <G mask="url(#googlevoice_mono_canvas_mask)">
        <Path
          d="M3.26915 5.73094L3.27279 5.7274C3.98388 5.03031 5.12533 5.03458 5.83106 5.74021L7.01697 6.92612C7.58497 7.49422 7.58497 8.41522 7.01697 8.98312L6.58969 9.41049C6.1636 9.83649 6.1636 10.5272 6.58969 10.9533L8.86506 13.2285C9.29106 13.6545 9.98179 13.6545 10.4078 13.2285L10.8351 12.8012C11.4031 12.2332 12.3241 12.2332 12.8921 12.8012L14.2597 14.1689C14.9653 14.8745 14.9696 16.0158 14.2726 16.7269V16.7276L14.2576 16.7422L14.1825 16.8173C14.1821 16.8177 14.1816 16.8177 14.1811 16.8173L14.1808 16.8171L14.1804 16.817L14.18 16.8171L14.1797 16.8173C12.5671 18.3332 10.0306 18.3034 8.4546 16.7274L3.27279 11.5456C1.69678 9.96958 1.66688 7.43312 3.18269 5.82049L3.18293 5.82013L3.18301 5.81972L3.18293 5.8193L3.18269 5.81894L3.18242 5.81857L3.18232 5.81812L3.18242 5.81768L3.18269 5.81731L3.25969 5.74031L3.26915 5.73094Z"
          fill="white"
          fillOpacity={0.3}
        />
        <Path
          d="M3.26915 5.73094L3.27279 5.7274C3.98388 5.03031 5.12533 5.03458 5.83106 5.74021L7.01697 6.92612C7.58497 7.49422 7.58497 8.41522 7.01697 8.98312L6.58969 9.41049C6.1636 9.83649 6.1636 10.5272 6.58969 10.9533L8.86506 13.2285C9.29106 13.6545 9.98179 13.6545 10.4078 13.2285L10.8351 12.8012C11.4031 12.2332 12.3241 12.2332 12.8921 12.8012L14.2597 14.1689C14.9653 14.8745 14.9696 16.0158 14.2726 16.7269V16.7276L14.2576 16.7422L14.1825 16.8173C14.1821 16.8177 14.1816 16.8177 14.1811 16.8173L14.1808 16.8171L14.1804 16.817L14.18 16.8171L14.1797 16.8173C12.5671 18.3332 10.0306 18.3034 8.4546 16.7274L3.27279 11.5456C1.69678 9.96958 1.66688 7.43312 3.18269 5.82049L3.18293 5.82013L3.18301 5.81972L3.18293 5.8193L3.18269 5.81894L3.18242 5.81857L3.18232 5.81812L3.18242 5.81768L3.18269 5.81731L3.25969 5.74031L3.26915 5.73094Z"
          fill={color}
        />
        <Mask
          id="googlevoice_mono_bubble_mask"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x={8}
          y={2}
          width={10}
          height={10}
        >
          <Path
            d="M16.9091 2H9.8182C9.21571 2 8.72729 2.48842 8.72729 3.09091V10.1818C8.72729 10.7843 9.21571 11.2727 9.8182 11.2727H16.9091C17.5116 11.2727 18 10.7843 18 10.1818V3.09091C18 2.48842 17.5116 2 16.9091 2Z"
            fill="#4D4D4D"
          />
        </Mask>
        <G mask="url(#googlevoice_mono_bubble_mask)">
          <Path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
}
