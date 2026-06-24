import type { JSX } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type PhoneIconProps = {
  width?: number | string;
  height?: number | string;
  /**
   * Stroke color. Defaults to black; pass the themed text-primary value to
   * track light/dark. The Figma "Default Black Default" variant uses
   * `strokeOpacity={0.3}` to render the dimmed/inactive look.
   */
  color?: string;
  strokeOpacity?: number | string;
};

/**
 * Phone-handset glyph used as the leading accessory on the profile page's
 * phone-number field. No brand color — single-stroke icon meant to be
 * themed by the caller.
 */
export default function PhoneIcon({
  width = 20,
  height = 20,
  color = '#000000',
  strokeOpacity = 1,
}: PhoneIconProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_phone_icon)">
        <Path
          d="M11.221 13.0453C11.3587 13.1085 11.5138 13.1229 11.6608 13.0862C11.8078 13.0495 11.9379 12.9638 12.0297 12.8433L12.2663 12.5333C12.3905 12.3677 12.5516 12.2333 12.7367 12.1407C12.9219 12.0481 13.126 11.9999 13.333 11.9999H15.333C15.6866 11.9999 16.0258 12.1404 16.2758 12.3904C16.5259 12.6405 16.6663 12.9796 16.6663 13.3333V15.3333C16.6663 15.6869 16.5259 16.026 16.2758 16.2761C16.0258 16.5261 15.6866 16.6666 15.333 16.6666C12.1504 16.6666 9.09816 15.4023 6.84773 13.1519C4.59729 10.9014 3.33301 7.84918 3.33301 4.66659C3.33301 4.31296 3.47348 3.97382 3.72353 3.72378C3.97358 3.47373 4.31272 3.33325 4.66634 3.33325H6.66634C7.01996 3.33325 7.3591 3.47373 7.60915 3.72378C7.8592 3.97382 7.99967 4.31296 7.99967 4.66659V6.66659C7.99967 6.87358 7.95148 7.07773 7.85891 7.26287C7.76634 7.44801 7.63194 7.60906 7.46634 7.73325L7.15434 7.96725C7.03195 8.0607 6.94569 8.19364 6.9102 8.34349C6.87472 8.49333 6.8922 8.65084 6.95967 8.78925C7.87079 10.6398 9.36929 12.1364 11.221 13.0453Z"
          stroke={color}
          strokeOpacity={strokeOpacity}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_phone_icon">
          <Rect width={16} height={16} fill="white" x={2} y={2} />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
