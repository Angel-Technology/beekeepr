import { useCallback } from 'react';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import type { ProfilePreviewUser } from '@components';
import {
  setDrawerPreview,
  type PreviewFriendshipState,
  type PreviewSource,
} from '../state/drawerPreviewStore';

/**
 * One-call helper for opening the right-side drawer with a profile
 * preview loaded. Wraps the two side effects (state + navigation) and
 * stamps the source so the drawer knows which header actions to render.
 *
 * `friendshipState` is optional and only meaningful for the `search`
 * source — the drawer reads it to pick Invite (NONE) vs Unsend
 * (REQUEST_SENT). Other sources encode the relationship in their
 * source name and ignore this arg.
 */
export const useOpenProfilePreview = () => {
  const navigation = useNavigation();
  return useCallback(
    (
      user: ProfilePreviewUser,
      source: PreviewSource,
      friendshipState: PreviewFriendshipState | null = null,
    ) => {
      setDrawerPreview(user, source, friendshipState);
      navigation.dispatch(DrawerActions.openDrawer());
    },
    [navigation],
  );
};
