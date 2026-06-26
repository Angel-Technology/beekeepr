import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useDrawerProgress } from '@react-navigation/drawer';
import { useAnimatedReaction } from 'react-native-reanimated';
import { MenuDrawerContent } from '@features/account';
import {
  clearDrawerPreview,
  useDrawerPreviewSource,
  useDrawerPreviewUser,
} from '../../../state/drawerPreviewStore';
import { ConnectionPreviewDrawerContent } from './ConnectionPreviewDrawerContent';
import { scheduleOnRN } from 'react-native-worklets';

/**
 * Drives the right-side drawer's content based on whether a connection
 * preview has been requested.
 *
 * Cycle:
 * 1. Default: renders `MenuDrawerContent`.
 * 2. A card row calls `setDrawerPreview(user, source)` + dispatches
 *    `openDrawer()` → this component re-renders and swaps in
 *    `ConnectionPreviewDrawerContent`.
 * 3. When the slide animation's `progress` hits 0 (fully off-screen)
 *    coming from a non-zero value, we clear the preview so the next
 *    swipe / menu tap sees `MenuDrawerContent` again.
 *
 * Why `useDrawerProgress` instead of `useDrawerStatus`:
 * `useDrawerStatus` flips to `'closed'` synchronously when the dismiss
 * is dispatched, ~200ms before the slide finishes. Clearing then would
 * swap content mid-close — the user sees the menu flash in behind the
 * still-sliding drawer. `useDrawerProgress` is the animated value, so
 * waiting for it to reach 0 is animation-accurate.
 */
export const DrawerContentSwitcher = (props: DrawerContentComponentProps) => {
  const previewUser = useDrawerPreviewUser();
  const previewSource = useDrawerPreviewSource();
  const progress = useDrawerProgress();

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      // `previous` is null on first mount. Only clear on a real
      // open→closed transition.
      if (current === 0 && previous !== null && previous > 0) {
        scheduleOnRN(clearDrawerPreview);
      }
    },
  );

  if (previewUser !== null) {
    return (
      <ConnectionPreviewDrawerContent
        {...props}
        user={previewUser}
        source={previewSource}
      />
    );
  }

  return <MenuDrawerContent {...props} />;
};
