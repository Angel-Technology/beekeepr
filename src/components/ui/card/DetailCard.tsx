import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type DetailCardItem =
  | string
  | {
      id?: string;
      label: ReactNode;
      icon?: ReactNode;
    };

type DetailCardTone = 'brand' | 'neutral' | 'surface';

type DetailCardProps = {
  title: string;
  items: DetailCardItem[];
  tone?: DetailCardTone;
  className?: string;
  titleClassName?: string;
  itemsClassName?: string;
  itemTextClassName?: string;
};

// Surface tokens kept separate from layout so callers can pick a tone without
// fighting NativeWind's class precedence rules on conflicting `bg-` utilities.
const SURFACE_BY_TONE: Record<DetailCardTone, string> = {
  brand: 'rounded-4 bg-brand-secondary p-5',
  neutral: 'rounded-xl bg-bg-weak p-4',
  surface: 'rounded-lg bg-white p-4',
};

export const DetailCard = ({
  title,
  items,
  tone = 'brand',
  className,
  titleClassName,
  itemsClassName,
  itemTextClassName,
}: DetailCardProps) => {
  return (
    <View
      className={clsx(
        'flex flex-col items-start gap-1 self-stretch',
        SURFACE_BY_TONE[tone],
        className,
      )}
    >
      <Text
        className={clsx(
          'items-stretch text-400 leading-300 text-text-default',
          titleClassName ? null : 'font-sourceSans-semiBold',
          titleClassName,
        )}
      >
        {title}
      </Text>
      <View
        className={clsx(
          'gap-1 self-stretch',
          itemsClassName ? null : 'pl-sm',
          itemsClassName,
        )}
      >
        {items.map((item, index) => (
          <View
            key={typeof item === 'string' ? item : (item.id ?? `item-${index}`)}
            className="flex-row items-start gap-2 self-stretch"
          >
            {typeof item === 'string' || !item.icon ? (
              <Text
                className={clsx(
                  'shrink-0 text-base text-text-secondary',
                  itemTextClassName ? null : 'font-sourceSans-regular',
                  itemTextClassName,
                )}
              >
                •
              </Text>
            ) : (
              <View className="mr-1 h-5 w-5 items-center justify-center">
                {item.icon}
              </View>
            )}
            {typeof item === 'string' ? (
              <Text
                className={clsx(
                  'flex-1 text-base text-text-secondary',
                  itemTextClassName ? null : 'font-sourceSans-regular',
                  itemTextClassName,
                )}
              >
                {item}
              </Text>
            ) : typeof item.label === 'string' ? (
              <Text
                className={clsx(
                  'flex-1 text-base text-text-secondary',
                  itemTextClassName ? null : 'font-sourceSans-regular',
                  itemTextClassName,
                )}
              >
                {item.label}
              </Text>
            ) : (
              <View className="flex-1">{item.label}</View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
