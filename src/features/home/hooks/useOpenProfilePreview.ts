import { useCallback } from 'react';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import type { ProfilePreviewUser } from '@components';
import {
  setDrawerPreview,
  type PreviewSource,
} from '../state/drawerPreviewStore';

/**
 * One-call helper for opening the right-side drawer with a profile
 * preview loaded. Wraps the two side effects (state + navigation) and
 * stamps the source so the drawer knows which header actions to render.
 */
export const useOpenProfilePreview = () => {
  const navigation = useNavigation();
  return useCallback(
    (user: ProfilePreviewUser, source: PreviewSource) => {
      setDrawerPreview(user, source);
      navigation.dispatch(DrawerActions.openDrawer());
    },
    [navigation],
  );
};
