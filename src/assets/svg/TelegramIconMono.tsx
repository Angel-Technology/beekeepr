import type { JSX } from 'react';
import Svg, { Path } from 'react-native-svg';

type TelegramIconMonoProps = {
  width?: number | string;
  height?: number | string;
  /**
   * Fill color for the paper-plane silhouette. Pass a themed value (e.g.
   * `tk-text-quaternary`) — the Figma "Black Default" variant bakes in
   * 30% opacity which we surface as the color's alpha channel instead.
   */
  color?: string;
};

/**
 * Monochrome Telegram icon — the empty-state pair to `TelegramIcon`.
 * Mirrors Figma node 3606:4885 ("Type=Telegram, Color=Black, State=Default").
 */
export default function TelegramIconMono({
  width = 20,
  height = 20,
  color = 'rgba(0, 0, 0, 0.3)',
}: TelegramIconMonoProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.35761 9.52888C7.49193 7.72762 10.2488 6.54013 11.6282 5.96639C15.5667 4.32824 16.3851 4.04368 16.9185 4.03428C17.0358 4.03221 17.2981 4.06129 17.468 4.19916C17.6115 4.31558 17.651 4.47285 17.6699 4.58323C17.6887 4.69361 17.7123 4.94505 17.6936 5.14152C17.4801 7.38402 16.5566 12.826 16.0868 15.3376C15.888 16.4004 15.4966 16.7567 15.1176 16.7916C14.294 16.8674 13.6687 16.2473 12.871 15.7244C11.6228 14.9062 10.9176 14.3969 9.70606 13.5985C8.30586 12.6758 9.21355 12.1686 10.0115 11.3398C10.2204 11.1229 13.849 7.82235 13.9193 7.52294C13.928 7.48549 13.9362 7.34591 13.8533 7.27221C13.7703 7.1985 13.648 7.22371 13.5596 7.24375C13.4345 7.27216 11.4404 8.59013 7.57762 11.1976C7.01162 11.5863 6.49897 11.7757 6.03964 11.7657C5.53327 11.7548 4.55922 11.4794 3.83512 11.244C2.94697 10.9553 2.24109 10.8027 2.30256 10.3124C2.33457 10.057 2.68626 9.79585 3.35761 9.52888Z"
        fill={color}
      />
    </Svg>
  );
}
