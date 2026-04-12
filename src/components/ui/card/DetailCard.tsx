import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type DetailCardItem =
  | string
  | {
      id?: string;
      label: string;
      icon: ReactNode;
    };

type DetailCardProps = {
  title: string;
  items: DetailCardItem[];
  className?: string;
  titleClassName?: string;
  itemsClassName?: string;
  itemTextClassName?: string;
};

export const DetailCard = ({
  title,
  items,
  className,
  titleClassName,
  itemsClassName,
  itemTextClassName,
}: DetailCardProps) => {
  return (
    <View
      className={clsx(
        'flex flex-col items-start gap-1 self-stretch rounded-4 bg-brand-secondary p-5',
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
        {items.map((item) => (
          <View
            key={typeof item === 'string' ? item : (item.id ?? item.label)}
            className={clsx(
              'flex-row gap-2 self-stretch',
              typeof item === 'string' ? 'items-start' : 'items-center',
            )}
          >
            {typeof item === 'string' ? (
              <Text className="shrink-0 font-sourceSans-regular text-base text-text-secondary">
                •
              </Text>
            ) : (
              <View className="mr-1 h-5 w-5 items-center justify-center">
                {item.icon}
              </View>
            )}
            <Text
              className={clsx(
                'flex-1 text-base text-text-secondary',
                itemTextClassName ? null : 'font-sourceSans-regular',
                itemTextClassName,
              )}
            >
              {typeof item === 'string' ? item : item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
