import { Fragment } from 'react';
import { View } from 'react-native';
import { Shimmer } from '@components';

/**
 * Pre-flow placeholder rendered while the Buzz tab waits on the auth
 * session + RevenueCat customer info. Mirrors the welcome layout
 * (`BuzzConnectionPill` + `BuzzConnectionsCard`) at real component
 * sizes — 52px pill, 44px avatars, py-5 rows — so the swap to the
 * live `BuzzWelcomeFlow` doesn't shift content.
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

export const BuzzScreenSkeleton = () => (
  <View className="w-full gap-7">
    {/* Tab pill (My connections / Invites). 52px to match the live
        `BuzzConnectionPill` (44px inner + p-1). */}
    <Shimmer className="h-[52px] w-full rounded-round" />

    {/* `InfoSection` title strip — matches the small uppercase label
        on `MY BUZZ BADGE CONNECTIONS`. */}
    <View className="gap-4">
      <Shimmer className="h-[18px] w-48 rounded-1" />

      {/* `FormCard`-shaped wrapper around the rows. Same border /
          radius / padding the populated `BuzzConnectionsCard` uses
          (`gap-0 px-6 py-2`). */}
      <View className="self-stretch rounded-5 border border-tk-border-secondary bg-tk-bg-primary px-6 py-2">
        {Array.from({ length: ROW_COUNT }).map((_, index) => (
          <Fragment key={index}>
            {index > 0 ? (
              <View className="h-px w-full bg-tk-border-secondary" />
            ) : null}
            <SkeletonRow />
          </Fragment>
        ))}
      </View>
    </View>
  </View>
);
