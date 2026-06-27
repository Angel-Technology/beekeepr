import { Fragment } from 'react';
import { View } from 'react-native';
import { Shimmer } from '@components';

/**
 * Placeholder shown under the search input while the backend query is
 * in-flight. Mirrors `SearchResultRow` (no container, divider between
 * rows, 32px avatar) so the swap to the live list doesn't shift
 * content.
 */
const ROW_COUNT = 4;

const SkeletonRow = () => (
  <View className="w-full flex-row items-center gap-3 py-3">
    <Shimmer className="size-8 rounded-round" />
    <View className="min-w-0 flex-1 gap-1.5">
      <Shimmer className="h-[14px] w-28 rounded-1" />
      <Shimmer className="h-[10px] w-16 rounded-1" />
    </View>
    <Shimmer className="size-7 rounded-1" />
  </View>
);

export const SearchResultsSkeleton = () => (
  <View className="self-stretch">
    {Array.from({ length: ROW_COUNT }).map((_, index) => (
      <Fragment key={index}>
        {index > 0 ? (
          <View className="bg-tk-border-secondary h-px w-full" />
        ) : null}
        <SkeletonRow />
      </Fragment>
    ))}
  </View>
);
