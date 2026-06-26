import { create } from 'zustand';
import type { ProfilePreviewUser } from '@components';

/**
 * Which list the user being previewed came from. Drives the header
 * actions in `ConnectionPreviewDrawerContent` — Remove for a friend,
 * Decline + Approve for an incoming invite, Unsend for an outgoing
 * invite, Unblock for a blocked user.
 */
export type PreviewSource = 'connection' | 'invite' | 'sent-invite' | 'blocked';

type DrawerPreviewState = {
  previewUser: ProfilePreviewUser | null;
  previewSource: PreviewSource | null;
  setPreview: (
    user: ProfilePreviewUser | null,
    source: PreviewSource | null,
  ) => void;
  clearPreview: () => void;
};

const useDrawerPreviewStore = create<DrawerPreviewState>((set) => ({
  previewUser: null,
  previewSource: null,
  setPreview: (user, source) =>
    set({ previewUser: user, previewSource: source }),
  clearPreview: () => set({ previewUser: null, previewSource: null }),
}));

// Component-friendly selectors.
export const useDrawerPreviewUser = () =>
  useDrawerPreviewStore((state) => state.previewUser);

export const useDrawerPreviewSource = () =>
  useDrawerPreviewStore((state) => state.previewSource);

// Imperative setters for non-component callers.
export const setDrawerPreview = (
  user: ProfilePreviewUser | null,
  source: PreviewSource | null,
) => useDrawerPreviewStore.getState().setPreview(user, source);

export const clearDrawerPreview = () =>
  useDrawerPreviewStore.getState().clearPreview();
