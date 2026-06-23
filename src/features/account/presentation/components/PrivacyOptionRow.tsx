import clsx from 'clsx';
import { Text, View } from 'react-native';
import { Switch } from '@components';

type PrivacyOptionRowProps = {
  badgeLabel: string;
  title: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

export const PrivacyOptionRow = ({
  badgeLabel,
  title,
  description,
  value,
  onChange,
}: PrivacyOptionRowProps) => (
  <View className="flex-row items-start gap-4">
    <View className="flex-1 gap-1">
      <View
        className={clsx(
          'self-start rounded-1 px-0.5 pb-0.5',
          value ? 'bg-bg-success' : 'bg-bg-weak',
        )}
      >
        <Text
          className={clsx(
            'font-lexend-regular text-caption',
            value ? 'text-text-inverse' : 'text-text-secondary',
          )}
        >
          {badgeLabel}
        </Text>
      </View>
      <Text
        className={clsx(
          'font-lexend-regular text-base',
          value ? 'text-text-default' : 'text-text-secondary',
        )}
        style={{ letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          className={clsx(
            'font-lexend-regular text-caption',
            value ? 'text-text-default' : 'text-text-tertiary',
          )}
        >
          {description}
        </Text>
      ) : null}
    </View>
    <View className="pt-6">
      <Switch value={value} onChange={onChange} accessibilityLabel={title} />
    </View>
  </View>
);
