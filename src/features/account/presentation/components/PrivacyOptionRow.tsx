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
  disabled?: boolean;
};

export const PrivacyOptionRow = ({
  badgeLabel,
  title,
  description,
  value,
  onChange,
  showBadge = true,
  disabled = false,
}: PrivacyOptionRowProps) => (
  <View
    className={clsx('flex-row items-start gap-4', disabled && 'opacity-50')}
  >
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
          <Text className="font-lexend-regular text-caption text-tk-text-primary-reversed">
            {badgeLabel}
          </Text>
        </View>
      ) : null}
      <Text
        className="font-lexend-regular text-base text-tk-text-primary"
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
      <Switch
        value={value}
        onChange={onChange}
        disabled={disabled}
        accessibilityLabel={title}
      />
    </View>
  </View>
);
