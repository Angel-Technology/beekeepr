import type { JSX } from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

type TelegramIconProps = {
  width?: number | string;
  height?: number | string;
};

/**
 * Telegram brand icon (paper-plane) in the official Telegram blue gradient.
 * The brand identity is fixed — no color prop. Pair with `PhoneIcon` when
 * you need a themable monochrome equivalent.
 */
export default function TelegramIcon({
  width = 20,
  height = 20,
}: TelegramIconProps): JSX.Element {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.09992 9.59642C7.39488 7.76182 10.2589 6.55233 11.6919 5.96797C15.7834 4.2995 16.6335 4.00967 17.1877 4.0001C17.3095 3.998 17.5821 4.02761 17.7586 4.16804C17.9076 4.28661 17.9486 4.44679 17.9683 4.55921C17.9879 4.67163 18.0123 4.92773 17.9929 5.12784C17.7712 7.41185 16.8118 12.9545 16.3237 15.5127C16.1172 16.5951 15.7105 16.958 15.3169 16.9936C14.4613 17.0707 13.8116 16.4392 12.9829 15.9066C11.6862 15.0733 10.9537 14.5545 9.69503 13.7413C8.24043 12.8015 9.18338 12.285 10.0124 11.4409C10.2293 11.22 13.999 7.8583 14.0719 7.55334C14.0811 7.5152 14.0895 7.37304 14.0034 7.29797C13.9172 7.2229 13.7901 7.24857 13.6983 7.26899C13.5683 7.29792 11.4968 8.64029 7.48389 11.2961C6.89591 11.6919 6.36333 11.8848 5.88616 11.8747C5.36012 11.8635 4.34822 11.5831 3.59598 11.3433C2.67333 11.0493 1.94002 10.8938 2.00388 10.3944C2.03714 10.1343 2.40248 9.86833 3.09992 9.59642Z"
        fill="url(#telegram_gradient)"
      />
      <Defs>
        <LinearGradient
          id="telegram_gradient"
          x1={10}
          y1={4}
          x2={10}
          y2={16.9036}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2AABEE" />
          <Stop offset={1} stopColor="#229ED9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
