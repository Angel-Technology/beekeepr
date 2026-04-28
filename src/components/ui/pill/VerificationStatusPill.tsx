import { Text, View } from 'react-native';
import clsx from 'clsx';
import IntroBeeIcon from '@assets/svg/IntroBeeIcon';

type VerificationStatusPillSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type VerificationStatusPillProps = {
  label: string;
  size?: VerificationStatusPillSize;
  className?: string;
  textClassName?: string;
  iconColor?: string;
};

const VERIFICATION_STATUS_PILL_SIZE_STYLES: Record<
  VerificationStatusPillSize,
  {
    container: string;
    text: string;
    iconWidth: number;
    iconHeight: number;
  }
> = {
  xs: {
    container: 'gap-1 px-2.5 py-1.5',
    text: 'text-xs',
    iconWidth: 11,
    iconHeight: 10,
  },
  sm: {
    container: 'gap-1.5 px-3 py-2',
    text: 'text-sm',
    iconWidth: 13,
    iconHeight: 11.5,
  },
  md: {
    container: 'gap-2 px-4 py-3',
    text: 'text-base',
    iconWidth: 15.75,
    iconHeight: 13.986,
  },
  lg: {
    container: 'gap-2 px-5 py-3',
    text: 'text-500',
    iconWidth: 17,
    iconHeight: 15,
  },
  xl: {
    container: 'gap-2.5 px-6 py-4',
    text: 'text-600',
    iconWidth: 18,
    iconHeight: 16,
  },
  '2xl': {
    container: 'gap-3 px-7 py-4',
    text: 'text-700',
    iconWidth: 20,
    iconHeight: 18,
  },
};

export const VerificationStatusPill = ({
  label,
  size = 'sm',
  className,
  textClassName,
  iconColor,
}: VerificationStatusPillProps) => {
  const sizeStyles = VERIFICATION_STATUS_PILL_SIZE_STYLES[size];

  return (
    <View
      className={clsx(
        'flex flex-row items-center justify-center self-center rounded-full bg-brand-highlight',
        sizeStyles.container,
        className,
      )}
    >
      <IntroBeeIcon
        width={sizeStyles.iconWidth}
        height={sizeStyles.iconHeight}
        color={iconColor}
      />
      <Text
        className={clsx(
          'font-sourceSans-semiBold text-text-default',
          textClassName ? null : sizeStyles.text,
          textClassName,
        )}
      >
        {label}
      </Text>
    </View>
  );
};
