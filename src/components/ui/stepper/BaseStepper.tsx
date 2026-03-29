import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import clsx from 'clsx';
import { VerticalSpacer } from '../spacing';

export type BaseStepperItem = {
  key: string;
  title: string;
  description?: string;
  icon: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  content?: ReactNode;
  iconWrapperClassName?: string;
  connectorClassName?: string;
};

type BaseStepperProps = {
  items: BaseStepperItem[];
  className?: string;
  itemClassName?: string;
  contentClassName?: string;
};

type StepperItemProps = {
  item: BaseStepperItem;
  isLast: boolean;
  itemClassName?: string;
  contentClassName?: string;
};

const StepperItem = ({
  item,
  isLast,
  itemClassName,
  contentClassName,
}: StepperItemProps) => {
  return (
    <View
      className={clsx('w-full flex-row items-stretch gap-5', itemClassName)}
    >
      <View className="items-center self-stretch">
        <View
          className={clsx(
            'z-10 items-center justify-center rounded-full bg-brand-primary p-3',
            item.iconWrapperClassName,
          )}
        >
          {item.icon}
        </View>

        {!isLast ? (
          <View
            className={clsx(
              'my-1 w-[2px] flex-1 bg-brand-primary',
              item.connectorClassName,
            )}
          />
        ) : null}
      </View>

      <View className={clsx('flex-1 gap-3', contentClassName)}>
        <Text
          className={clsx(
            'font-poppins-semiBold text-400 text-text-default',
            item.titleClassName,
          )}
        >
          {item.title}
        </Text>

        {item.description ? (
          <Text
            className={clsx(
              'font-poppins-regular text-300 text-text-weak',
              item.descriptionClassName,
            )}
          >
            {item.description}
          </Text>
        ) : null}

        {item.content}
        {!isLast && <VerticalSpacer size="md" />}
      </View>
    </View>
  );
};

export const BaseStepper = ({
  items,
  className,
  itemClassName,
  contentClassName,
}: BaseStepperProps) => {
  return (
    <View className={clsx('w-full gap-0', className)}>
      {items.map((item, index) => (
        <StepperItem
          key={item.key}
          item={item}
          isLast={index === items.length - 1}
          itemClassName={itemClassName}
          contentClassName={contentClassName}
        />
      ))}
    </View>
  );
};
