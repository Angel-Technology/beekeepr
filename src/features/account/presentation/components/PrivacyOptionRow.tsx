import clsx from 'clsx';
import { Text, View } from 'react-native';
import { Switch } from '@components';

type PrivacyOptionRowProps = {
  badgeLabel: string;
  title: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  /**
   * Show the small status badge above the title. Profile-visibility rows
   * use it; the contact-sharing rows in the Figma render without it.
   */
  showBadge?: boolean;
};

export const PrivacyOptionRow = ({
  badgeLabel,
  title,
  description,
  value,
  onChange,
  showBadge = true,
}: PrivacyOptionRowProps) => (
  <View className="flex-row items-start gap-4">
    <View className="flex-1 gap-1">
      {showBadge ? (
        <View
          className={clsx(
            'self-start rounded-1 px-0.5 pb-0.5',
            value
              ? 'bg-tk-alerts-success'
              : 'bg-tk-actions-neutral-background-solid-hover',
          )}
        >
          <Text className="text-tk-text-primary-reversed font-lexend-regular text-caption">
            {badgeLabel}
          </Text>
        </View>
      ) : null}
      <Text
        className="text-tk-text-primary font-lexend-regular text-base"
        style={{ letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          className={clsx(
            'font-lexend-regular text-caption',
            value ? 'text-tk-text-primary' : 'text-tk-text-tertiary',
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
