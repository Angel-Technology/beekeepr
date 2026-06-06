import type { ReactNode } from 'react';
import clsx from 'clsx';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomActionBarProps = {
  children: ReactNode;
  className?: string;
  /**
   * When true (default), adds bottom safe-area inset so the bar clears the
   * home indicator. Set to false when rendered inside a parent that already
   * handles bottom safe-area (e.g. a SafeAreaView with `bottom` edge).
   */
  includeSafeAreaInset?: boolean;
};

export const BottomActionBar = ({
  children,
  className,
  includeSafeAreaInset = true,
}: BottomActionBarProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={clsx(
        'w-full gap-3 bg-bg-default px-6 pt-4 shadow-bottom-bar',
        className,
      )}
      style={{
        paddingBottom: includeSafeAreaInset ? insets.bottom + 16 : 16,
      }}
    >
      {children}
    </View>
  );
};
