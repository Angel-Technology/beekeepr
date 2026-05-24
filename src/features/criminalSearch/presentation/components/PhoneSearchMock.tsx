import { Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import clsx from 'clsx';
import { Input } from '@components';

type SearchTab = 'phone' | 'nameLocation';

const TABS: readonly { id: SearchTab; label: string }[] = [
  { id: 'phone', label: 'Phone' },
  { id: 'nameLocation', label: 'Name & Location' },
];

const SearchTabsPill = ({ active }: { active: SearchTab }) => {
  return (
    <View className="flex-row items-center self-stretch overflow-hidden rounded-round bg-bg-weak p-1">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <View
            key={tab.id}
            className={clsx(
              'min-h-[44px] flex-1 items-center justify-center rounded-round px-4',
              isActive ? 'shadow-small bg-white' : null,
            )}
          >
            <Text
              className={clsx(
                'font-sourceSans-semiBold text-base',
                isActive ? 'text-text-default' : 'text-text-secondary',
              )}
            >
              {tab.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

/**
 * Read-only mock of the criminal-search form rendered while the feature is
 * pre-launch. Visuals match the live form so the placeholder gives users a
 * preview of what to expect; the screen wraps this with `opacity-50` and
 * blocks interactions.
 */
export const PhoneSearchMock = () => {
  return (
    <View className="self-stretch" pointerEvents="none">
      <View className="p-4">
        <SearchTabsPill active="phone" />
      </View>

      <View className="overflow-hidden rounded-xl bg-bg-weak">
        <View className="px-6 py-4">
          <Input
            label="Phone Number"
            value=""
            disabled
            onChangeText={() => undefined}
            placeholder="(123) 456-7890"
            type="phone"
          />
        </View>
        <View className="min-h-[32px] flex-row items-center justify-center gap-2 border-t border-border-subtle px-6 py-4">
          <Text className="flex-1 font-sourceSans-semiBold text-sm text-text-secondary">
            Show More Search Fields
          </Text>
          <ChevronDown size={14} color="rgba(0,0,0,0.7)" />
        </View>
      </View>
    </View>
  );
};
