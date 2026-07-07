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

const SURFACE_BY_TONE: Record<DetailCardTone, string> = {
  brand: 'rounded-5 bg-tk-bg-callout p-5',
  neutral: 'rounded-5 bg-tk-bg-secondary p-5',
  surface: 'rounded-5 bg-tk-bg-primary p-5',
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
        'flex flex-col items-start gap-5 self-stretch',
        SURFACE_BY_TONE[tone],
        className,
      )}
    >
      <Text
        className={clsx(
          'text-base leading-6 text-tk-text-primary',
          titleClassName ? null : 'font-lexend-semiBold',
          titleClassName,
        )}
      >
        {title}
      </Text>
      <View className={clsx('gap-5 self-stretch', itemsClassName)}>
        {items.map((item, index) => (
          <View
            key={typeof item === 'string' ? item : (item.id ?? `item-${index}`)}
            className="flex-row items-start gap-3 self-stretch"
          >
            {typeof item === 'string' || !item.icon ? (
              <Text
                className={clsx(
                  'shrink-0 text-subhead leading-5 text-tk-text-secondary',
                  itemTextClassName ? null : 'font-lexend-regular',
                  itemTextClassName,
                )}
              >
                •
              </Text>
            ) : (
              <View className="items-center justify-center">{item.icon}</View>
            )}
            {typeof item === 'string' ? (
              <Text
                className={clsx(
                  'flex-1 text-subhead leading-5 text-tk-text-secondary',
                  itemTextClassName ? null : 'font-lexend-regular',
                  itemTextClassName,
                )}
              >
                {item}
              </Text>
            ) : typeof item.label === 'string' ? (
              <Text
                className={clsx(
                  'flex-1 text-subhead leading-5 text-tk-text-secondary',
                  itemTextClassName ? null : 'font-lexend-regular',
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
