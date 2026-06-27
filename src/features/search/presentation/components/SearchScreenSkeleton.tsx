import { View } from 'react-native';
import { Shimmer } from '@components';

/**
 * Page-level placeholder rendered while the Search tab waits on the
 * auth session + RevenueCat customer info. Mirrors the resting
 * `SearchScreen` layout — `BUZZ BADGE COMMUNITY` section label, a
 * `FormCard`-shaped input panel — so the swap to the live screen
 * doesn't shift content. Only the input chrome shimmers; result rows
 * stay hidden because gating isn't resolved yet.
 */
export const SearchScreenSkeleton = () => (
  <View className="w-full gap-6">
    <View className="px-1">
      <Shimmer className="h-5 w-44 rounded-1" />
    </View>

    <View className="border-tk-border-secondary bg-tk-bg-primary gap-3 self-stretch rounded-5 border p-6">
      <Shimmer className="h-3 w-28 rounded-1" />
      <Shimmer className="h-8 w-full rounded-2" />
    </View>
  </View>
);
