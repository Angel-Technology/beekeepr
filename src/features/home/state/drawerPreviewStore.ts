import { create } from 'zustand';
import type { ProfilePreviewUser } from '@components';

/**
 * Which list the user being previewed came from. Drives the header
 * actions in `ConnectionPreviewDrawerContent` — Remove for a friend,
 * Decline + Approve for an incoming invite, Unsend for an outgoing
 * invite, Unblock for a blocked user. `search` rows pivot on the
 * viewer's friendship state with the row's user (see
 * `previewFriendshipState`) — Invite when none, Unsend when already
 * pending, etc.
 */
export type PreviewSource =
  | 'connection'
  | 'invite'
  | 'sent-invite'
  | 'blocked'
  | 'search';

/**
 * String-literal mirror of the backend `ViewerFriendshipState` enum.
 * Spelled out inline to avoid pulling a feature's `*.generated` enum
 * into the cross-feature drawer store. Only relevant when
 * `previewSource === 'search'` — other sources already encode the
 * friendship state via their name.
 */
export type PreviewFriendshipState =
  | 'FRIENDS'
  | 'NONE'
  | 'REQUEST_RECEIVED'
  | 'REQUEST_SENT';

type DrawerPreviewState = {
  previewUser: ProfilePreviewUser | null;
  previewSource: PreviewSource | null;
  previewFriendshipState: PreviewFriendshipState | null;
  setPreview: (
    user: ProfilePreviewUser | null,
    source: PreviewSource | null,
    friendshipState?: PreviewFriendshipState | null,
  ) => void;
  clearPreview: () => void;
};

const useDrawerPreviewStore = create<DrawerPreviewState>((set) => ({
  previewUser: null,
  previewSource: null,
  previewFriendshipState: null,
  setPreview: (user, source, friendshipState = null) =>
    set({
      previewUser: user,
      previewSource: source,
      previewFriendshipState: friendshipState,
    }),
  clearPreview: () =>
    set({
      previewUser: null,
      previewSource: null,
      previewFriendshipState: null,
    }),
}));

// Component-friendly selectors.
export const useDrawerPreviewUser = () =>
  useDrawerPreviewStore((state) => state.previewUser);

export const useDrawerPreviewSource = () =>
  useDrawerPreviewStore((state) => state.previewSource);

export const useDrawerPreviewFriendshipState = () =>
  useDrawerPreviewStore((state) => state.previewFriendshipState);

// Imperative setters for non-component callers.
export const setDrawerPreview = (
  user: ProfilePreviewUser | null,
  source: PreviewSource | null,
  friendshipState: PreviewFriendshipState | null = null,
) => useDrawerPreviewStore.getState().setPreview(user, source, friendshipState);

export const clearDrawerPreview = () =>
  useDrawerPreviewStore.getState().clearPreview();
