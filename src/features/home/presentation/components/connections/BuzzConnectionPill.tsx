import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import clsx from 'clsx';

import type { ConnectionTab } from '../../../models/connectionTab';

// Re-export so existing presentation-layer consumers (BuzzWelcomeFlow,
// the connections barrel) keep their imports stable. The type itself
// lives in `models/` so the hook layer can read it without crossing
// the presentation lint boundary.
export type { ConnectionTab };

const TABS = [
  { id: 'connections' as const, label: 'My connections' },
  { id: 'invites' as const, label: 'Invites' },
];

type BuzzConnectionPillProps = {
  active: ConnectionTab;
  onChange: (next: ConnectionTab) => void;
  /**
   * Pending-invite count surfaced as a red badge inside the Invites
   * tab. `0` or `undefined` hides the badge; the number is clamped at
   * "99+" so a buggy / spammy backend can't blow the pill's width.
   */
  inviteCount?: number;
};

const HORIZONTAL_PADDING_PX = 8;
const MAX_BADGE_COUNT = 99;

export const BuzzConnectionPill = ({
  active,
  onChange,
  inviteCount = 0,
}: BuzzConnectionPillProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const tabWidth = Math.max((containerWidth - HORIZONTAL_PADDING_PX) / 2, 0);
  const activeIndex = TABS.findIndex((tab) => tab.id === active);

  const translateX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth <= 0) {
      return;
    }
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, tabWidth, translateX]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="self-stretch overflow-hidden rounded-round bg-tk-bg-elevated-secondary p-1"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <View className="relative flex-row items-center">
        {tabWidth > 0 ? (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: tabWidth,
              },
              animatedPillStyle,
            ]}
            className="rounded-round border border-tk-border-secondary bg-tk-bg-primary shadow-small"
          />
        ) : null}

        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const showBadge = tab.id === 'invites' && inviteCount > 0;
          const badgeLabel =
            inviteCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : inviteCount;
          return (
            <TouchableOpacity
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={
                showBadge ? `${tab.label}, ${inviteCount} pending` : tab.label
              }
              onPress={() => onChange(tab.id)}
              className="min-h-[44px] flex-1 items-center justify-center px-4"
            >
              {/* `relative` wrapper so the badge can be absolutely
                  pinned to the text's corner — sits slightly above and
                  to the right of the label, superscript-style. */}
              <View className="relative">
                <Text
                  className={clsx(
                    'font-lexend-semiBold text-sm',
                    isActive
                      ? 'text-tk-text-primary'
                      : 'text-tk-text-secondary',
                  )}
                >
                  {tab.label}
                </Text>
                {showBadge ? (
                  <View className="absolute -right-4 -top-1.5 items-center justify-center rounded-full bg-tk-alerts-danger px-1">
                    <Text className="font-lexend-semiBold text-xs text-white">
                      {badgeLabel}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
