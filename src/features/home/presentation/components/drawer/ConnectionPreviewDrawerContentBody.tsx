import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  EllipsisVertical,
  Send,
  Trash,
  X,
} from 'lucide-react-native';
import {
  APP_HEADER_HEIGHT,
  AppHeader,
  CompactButton,
  IconButton,
  ProfilePreviewBody,
  type ProfilePreviewUser,
} from '@components';
import { cn, themedColors, useThemedColor } from '@common';
import type {
  PreviewFriendshipState,
  PreviewSource,
} from '../../../state/drawerPreviewStore';
import { ProfileActionsMenu } from './ProfileActionsMenu';

type ConnectionPreviewDrawerContentBodyProps = {
  /**
   * The user being previewed. Shape is the shared `ProfilePreviewUser`
   * so both `UserConnectionDto` (home lists) and `UserGraph` (search
   * results) satisfy it as-is.
   */
  user: ProfilePreviewUser;
  /**
   * Which list the row came from. Drives the header action row:
   *
   * - `connection` (or `null` — treated as default) → Remove
   * - `invite` → Decline + Approve
   * - `sent-invite` → Unsend
   * - `blocked` → Unblock
   * - `search` → Invite (NONE) / Unsend (REQUEST_SENT)
   */
  source: PreviewSource | null;
  /**
   * The viewer's friendship state with `user`. Only pivots behavior
   * when `source === 'search'` (Invite vs Unsend). Other sources
   * already encode the friendship state via their name.
   */
  friendshipState: PreviewFriendshipState | null;
  /** Tap the back chevron / cancel gesture. Wrapper calls `navigation.closeDrawer()`. */
  onClose: () => void;
  /** Remove-friend action from the `connection` header. Wrapper wraps in a confirm. */
  onRemove: () => void;
  /** Approve an incoming invite from the `invite` header. */
  onAccept: () => void;
  /** Decline an incoming invite from the `invite` header. */
  onDecline: () => void;
  /** Cancel an outgoing invite (from `sent-invite` or search `REQUEST_SENT`). */
  onUnsend: () => void;
  /** Unblock a previously blocked user from the `blocked` header. */
  onUnblock: () => void;
  /** Send an invite from the search `NONE` header. */
  onSendInvite: () => void;
  /** Block the user from the kebab menu. Wrapper wraps in a confirm. */
  onBlock: () => void;
  /** Flag the user from the kebab menu. Wrapper wraps in a confirm. */
  onFlag: () => void;
};

/**
 * Pure presentation body for the right-side connection-preview drawer.
 * Renders the header (back chevron, source-dependent action row,
 * kebab), the shared `ProfilePreviewBody`, the outside-tap dismiss
 * overlay for the kebab menu, and the `ProfileActionsMenu` dropdown.
 *
 * Reads no feature hooks — only theming (`useThemedColor`) + safe-area
 * (`useSafeAreaInsets`) helpers. Local `useState` owns the actions-menu
 * visibility, which is a pure UI toggle. The connected
 * `ConnectionPreviewDrawerContent` runs the seven mutation hooks
 * (`useBlockUser`, `useCancelInvite`, `useFlagUser`, `useRemoveFriend`,
 * `useRespondToInvite`, `useSendInvite`, `useUnblockUser`) plus
 * `useConfirmDestructive` and forwards a callback bundle into this
 * body. Stories render this body directly with stubs — no navigation,
 * TanStack Query, or GraphQL client mocks needed.
 *
 * Header actions vary by source:
 *
 * - `connection` (or `null` default) → Remove (friend)
 * - `invite` → Decline + Approve
 * - `sent-invite` → Unsend
 * - `blocked` → Unblock
 * - `search` → Invite (NONE) or Unsend (REQUEST_SENT), with Block /
 *   Flag still in the kebab so the affordance set matches every other
 *   source rather than gaining a one-off inline pair.
 *
 * The kebab dropdown (Block / Flag) is available on every source. The
 * destructive trio (Block / Flag / Remove) is expected to route through
 * `ConfirmDestructiveModal` in the wrapper — this body just fires the
 * callbacks it was given. Reversible actions (Decline, Unsend, Unblock,
 * Invite, Approve) fire-and-close from the wrapper side.
 */
export const ConnectionPreviewDrawerContentBody = ({
  user,
  source,
  friendshipState,
  onClose,
  onRemove,
  onAccept,
  onDecline,
  onUnsend,
  onUnblock,
  onSendInvite,
  onBlock,
  onFlag,
}: ConnectionPreviewDrawerContentBodyProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);
  // Matches the `text-tk-actions-neutral-text-on-action` class CompactButton
  // uses for solid-variant labels — white in light mode, black in dark mode.
  const onActionIconColor = useThemedColor(themedColors.text.primaryReversed);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  const closeMenu = () => setIsActionsMenuOpen(false);
  // Wrap the kebab-menu items so tapping Block / Flag closes the menu
  // before delegating to the wrapper's confirm-then-mutate flow.
  const handleBlock = () => {
    closeMenu();
    onBlock();
  };
  const handleFlag = () => {
    closeMenu();
    onFlag();
  };

  return (
    <View className="bg-tk-bg-primary flex-1">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Close"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} color={iconColor} />}
            onPress={onClose}
          />
        }
        right={
          <View className="flex-row items-center gap-2 pr-1">
            <SourceActions
              source={source}
              friendshipState={friendshipState}
              iconColor={iconColor}
              onActionIconColor={onActionIconColor}
              onRemove={onRemove}
              onAccept={onAccept}
              onDecline={onDecline}
              onUnsend={onUnsend}
              onUnblock={onUnblock}
              onSendInvite={onSendInvite}
            />
            <IconButton
              accessibilityLabel="More actions"
              className={cn(
                'size-7 rounded-round border-none',
                isActionsMenuOpen
                  ? 'bg-tk-bg-elevated-secondary'
                  : 'bg-transparent',
              )}
              icon={
                <EllipsisVertical
                  size={20}
                  strokeWidth={2.2}
                  color={iconColor}
                />
              }
              onPress={() => setIsActionsMenuOpen((prev) => !prev)}
            />
          </View>
        }
      />

      <ProfilePreviewBody user={user} onScrollBeginDrag={closeMenu} />

      {/* Outside-tap dismissal. Starts BELOW the header so the kebab
          stays tappable (toggling the menu off goes through the
          kebab's own `onPress`, not through this overlay). Rendered
          BEFORE the menu so the menu sits on top in RN's
          last-rendered-wins z order. */}
      {isActionsMenuOpen ? (
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={closeMenu}
          style={{
            position: 'absolute',
            top: insets.top + APP_HEADER_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      ) : null}

      <ProfileActionsMenu
        visible={isActionsMenuOpen}
        onBlock={handleBlock}
        onFlag={handleFlag}
      />
    </View>
  );
};

type SourceActionsProps = {
  source: PreviewSource | null;
  friendshipState: PreviewFriendshipState | null;
  iconColor: string;
  onActionIconColor: string;
  onRemove: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onUnsend: () => void;
  onUnblock: () => void;
  onSendInvite: () => void;
};

const SourceActions = ({
  source,
  friendshipState,
  iconColor,
  onActionIconColor,
  onRemove,
  onAccept,
  onDecline,
  onUnsend,
  onUnblock,
  onSendInvite,
}: SourceActionsProps) => {
  switch (source) {
    case 'invite':
      return (
        <>
          <CompactButton
            label="Decline"
            variant="outline"
            onPress={onDecline}
            className="min-h-0 self-auto px-3 py-2"
            textClassName="text-sm"
          />
          <CompactButton
            label="Approve"
            variant="solid"
            onPress={onAccept}
            className="min-h-0 self-auto px-3 py-2"
            textClassName="text-sm"
          />
        </>
      );
    case 'sent-invite':
      return (
        <CompactButton
          label="Unsend"
          variant="outline"
          iconLeft={<X size={16} strokeWidth={2.2} color={iconColor} />}
          onPress={onUnsend}
          className="min-h-0 self-auto px-3 py-2"
          textClassName="text-sm"
        />
      );
    case 'blocked':
      return (
        <CompactButton
          label="Unblock"
          variant="outline"
          onPress={onUnblock}
          className="min-h-0 self-auto px-3 py-2"
          textClassName="text-sm"
        />
      );
    case 'search':
      return friendshipState === 'REQUEST_SENT' ? (
        <CompactButton
          label="Unsend"
          variant="outline"
          iconLeft={<X size={16} strokeWidth={2.2} color={iconColor} />}
          onPress={onUnsend}
          className="min-h-0 self-auto px-3 py-2"
          textClassName="text-sm"
        />
      ) : (
        <CompactButton
          label="Send Invite"
          variant="solid"
          iconLeft={
            <Send size={16} strokeWidth={2.2} color={onActionIconColor} />
          }
          onPress={onSendInvite}
          className="min-h-0 self-auto px-3 py-2"
          textClassName="text-sm"
        />
      );
    // Default + 'connection' both render the Remove button.
    default:
      return (
        <CompactButton
          label="Remove"
          variant="outline"
          iconLeft={<Trash size={16} strokeWidth={2.2} color={iconColor} />}
          onPress={onRemove}
          className="min-h-0 self-auto px-3 py-2"
          textClassName="text-sm"
        />
      );
  }
};

export type { ConnectionPreviewDrawerContentBodyProps };
