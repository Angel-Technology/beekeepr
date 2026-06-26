import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';

import { themedColors, useThemedColor } from '@common';

type BaseBottomSheetProps = {
  visible: boolean;
  /**
   * Fires when the sheet finishes its dismiss animation, including
   * backdrop tap and swipe-down. The caller is expected to flip its
   * `visible` flag in this handler so a follow-up `present()` works.
   */
  onClose: () => void;
  /**
   * Snap points as percentages of screen height or fixed numbers, in
   * ascending order. Defaults to a single `'90%'` snap (matches the
   * project's most common bottom-sheet sizing).
   */
  snapPoints?: ReadonlyArray<string | number>;
  /**
   * Optional title — when set the sheet renders a header row with the
   * title on the left and a Close (X) button on the right. Omit for a
   * raw sheet with no chrome (the caller draws its own header).
   */
  title?: string;
  children: ReactNode;
};

const DEFAULT_SNAP_POINTS: ReadonlyArray<string | number> = ['90%'];

/**
 * Themed wrapper around `@gorhom/bottom-sheet`'s `BottomSheetModal`.
 *
 * The base sheet owns the chrome that every sheet in the app should
 * share — themed surface + handle indicator, dim backdrop, tap-to-close
 * behavior, optional title header — and exposes a familiar `visible`
 * prop so callers don't have to plumb through a ref/imperative API.
 *
 * Internally a `useEffect` mirrors the `visible` prop to `present()` /
 * `dismiss()` on the modal ref. `onDismiss` is wired to the caller's
 * `onClose` so swipe-down works out of the box.
 *
 * Content layout note: gorhom requires scrollable regions to use its
 * `BottomSheetScrollView` / `BottomSheetFlatList` so vertical drags
 * inside the sheet still propagate to the sheet handle for "swipe to
 * close". Plain `ScrollView` blocks gestures and breaks dismissal.
 */
export const BaseBottomSheet = ({
  visible,
  onClose,
  snapPoints = DEFAULT_SNAP_POINTS,
  title,
  children,
}: BaseBottomSheetProps) => {
  const ref = useRef<BottomSheetModal>(null);
  const surface = useThemedColor(themedColors.bg.primary);
  // Backdrop uses the elevated bg so the area behind the sheet reads as
  // a raised surface against the sheet's own `bg.primary` panel.
  const backdrop = useThemedColor(themedColors.bg.elevatedTertiary);
  const handle = useThemedColor(themedColors.border.primary);
  const closeColor = useThemedColor(themedColors.text.secondary);

  // Mirror the declarative `visible` prop onto the modal's imperative
  // API. Gorhom v5 expects a `present()` to register the modal in the
  // portal — a render alone doesn't surface it.
  useEffect(() => {
    if (visible) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        style={{ backgroundColor: backdrop }}
      />
    ),
    [backdrop],
  );

  // Memoize so reference equality keeps the modal from re-mounting its
  // snap container on every parent re-render.
  const snapPointsArray = useMemo(() => [...snapPoints], [snapPoints]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPointsArray}
      // Gorhom v5 defaults `enableDynamicSizing` to `true`, which
      // shrinks the sheet to content height and ignores `snapPoints`
      // when the content fits. That makes a 90%-snap sheet land at
      // ~50% on phones with our content. Force-disable so the caller's
      // snap points win.
      enableDynamicSizing={false}
      index={0}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: surface }}
      handleIndicatorStyle={{ backgroundColor: handle }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {title ? (
          <View className="w-full flex-row items-center justify-between px-6 pb-4 pt-2">
            <Text className="text-tk-text-primary font-poppins-semiBold text-title-4">
              {title}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="p-1"
            >
              <X size={24} color={closeColor} />
            </TouchableOpacity>
          </View>
        ) : null}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
