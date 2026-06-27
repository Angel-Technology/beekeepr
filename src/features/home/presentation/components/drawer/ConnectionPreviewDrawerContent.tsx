import { useRef, useState } from 'react';
import { View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  EllipsisVertical,
  Send,
  Trash,
  X,
} from 'lucide-react-native';
import {
  AppHeader,
  CompactButton,
  ConfirmDestructiveModal,
  IconButton,
  ProfilePreviewBody,
  type ProfilePreviewUser,
} from '@components';
import { cn, themedColors, useThemedColor } from '@common';
import { useBlockUser } from '../../../hooks/useBlockUser';
import { useCancelInvite } from '../../../hooks/useCancelInvite';
import { useFlagUser } from '../../../hooks/useFlagUser';
import { useRemoveFriend } from '../../../hooks/useRemoveFriend';
import { useRespondToInvite } from '../../../hooks/useRespondToInvite';
import { useSendInvite } from '../../../hooks/useSendInvite';
import { useUnblockUser } from '../../../hooks/useUnblockUser';
import type {
  PreviewFriendshipState,
  PreviewSource,
} from '../../../state/drawerPreviewStore';
import { ProfileActionsMenu } from './ProfileActionsMenu';

type ConnectionPreviewDrawerContentProps = DrawerContentComponentProps & {
  user: ProfilePreviewUser;
  source: PreviewSource | null;
  friendshipState: PreviewFriendshipState | null;
};

type ConfirmKind = 'block' | 'flag' | 'remove';

const CONFIRM_COPY: Record<
  ConfirmKind,
  { title: string; description: string; confirmLabel: string }
> = {
  block: {
    title: 'Block user?',
    description:
      "They won't be able to send invites or see your profile. You can unblock them from your settings later.",
    confirmLabel: 'Block',
  },
  flag: {
    title: 'Flag user?',
    description:
      "Our team will review their account. We won't share that you flagged them.",
    confirmLabel: 'Flag',
  },
  remove: {
    title: 'Remove connections?',
    description:
      "They'll lose access to your shared contact info. You can re-invite them later.",
    confirmLabel: 'Remove',
  },
};

/**
 * Right-side drawer content rendered when a card row is tapped. Body is
 * the shared `ProfilePreviewBody`; the header actions vary by source:
 *
 * - `connection` → Remove (friend)
 * - `invite` → Decline + Approve
 * - `sent-invite` → Unsend
 * - `blocked` → Unblock
 * - `search` → Invite (NONE) or Unsend (REQUEST_SENT), with Block /
 *   Flag still in the kebab so the affordance set matches every other
 *   source rather than gaining a one-off inline pair.
 *
 * The kebab dropdown (Block / Flag) is available on every source. The
 * destructive trio (Block / Flag / Remove) routes through a single
 * `ConfirmDestructiveModal` instead of firing immediately — copy swaps
 * based on which action was tapped. Reversible actions (Decline,
 * Unsend, Unblock, Invite, Approve) still fire-and-close like before.
 */
export const ConnectionPreviewDrawerContent = ({
  navigation,
  user,
  source,
  friendshipState,
}: ConnectionPreviewDrawerContentProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);
  // Matches the `text-tk-actions-neutral-text-on-action` class CompactButton
  // uses for solid-variant labels — white in light mode, black in dark mode.
  const onActionIconColor = useThemedColor(themedColors.text.primaryReversed);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  // Tracks whether the outer touch-capture handler just closed the menu
  // on the same gesture that's about to hit the kebab. Lets the kebab
  // skip its open-handler so we don't re-open the menu the user is
  // trying to close.
  const dismissedByOutsideTouchRef = useRef(false);

  const { remove: removeFriend } = useRemoveFriend();
  const { accept: acceptInvite, decline: declineInvite } = useRespondToInvite();
  const { cancel: cancelInvite } = useCancelInvite();
  const { send: sendInvite } = useSendInvite();
  const { unblock: unblockUser } = useUnblockUser();
  const { block: blockUser } = useBlockUser();
  const { flag: flagUser } = useFlagUser();

  // Single piece of "which destructive action is pending confirmation"
  // state. `null` while the modal is hidden; switches the modal copy
  // and the action that fires on confirm.
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmKind | null>(
    null,
  );

  const closeDrawer = () => navigation.closeDrawer();

  const runAndClose = (action: (id: string) => void) => () => {
    action(user.id);
    closeDrawer();
  };

  // Open the confirm modal rather than firing immediately. Also close
  // the kebab dropdown if that's where the user came from.
  const requestConfirm = (kind: ConfirmKind) => () => {
    setIsActionsMenuOpen(false);
    setPendingConfirm(kind);
  };

  const handleConfirm = () => {
    if (pendingConfirm === null) {
      return;
    }
    const action =
      pendingConfirm === 'block'
        ? blockUser
        : pendingConfirm === 'flag'
          ? flagUser
          : removeFriend;
    action(user.id);
    setPendingConfirm(null);
    closeDrawer();
  };

  return (
    <View
      className="bg-tk-bg-primary flex-1"
      // Outer capture: when the menu is open, ANY touch start anywhere
      // in the drawer closes it. Returning `false` releases the
      // responder so the underlying element (kebab, menu item, scroll,
      // header button) still receives its own touch and fires its
      // handler normally.
      onStartShouldSetResponderCapture={() => {
        if (isActionsMenuOpen) {
          dismissedByOutsideTouchRef.current = true;
          setIsActionsMenuOpen(false);
        } else {
          // Menu is already closed → this is a fresh gesture. Clear
          // any leftover "skip" signal from a previous close that
          // didn't land on the kebab.
          dismissedByOutsideTouchRef.current = false;
        }
        return false;
      }}
    >
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Close"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} color={iconColor} />}
            onPress={closeDrawer}
          />
        }
        right={
          <View className="flex-row items-center gap-2 pr-1">
            <SourceActions
              source={source}
              friendshipState={friendshipState}
              iconColor={iconColor}
              onActionIconColor={onActionIconColor}
              onRemove={requestConfirm('remove')}
              onAccept={runAndClose(acceptInvite)}
              onDecline={runAndClose(declineInvite)}
              onUnsend={runAndClose(cancelInvite)}
              onUnblock={runAndClose(unblockUser)}
              onSendInvite={runAndClose(sendInvite)}
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
              onPress={() => {
                if (dismissedByOutsideTouchRef.current) {
                  // Outer capture just closed the menu on this same
                  // gesture; don't re-open from the kebab tap.
                  dismissedByOutsideTouchRef.current = false;
                  return;
                }
                setIsActionsMenuOpen(true);
              }}
            />
          </View>
        }
      />

      <ProfilePreviewBody
        user={user}
        onScrollBeginDrag={() => setIsActionsMenuOpen(false)}
      />

      <ProfileActionsMenu
        visible={isActionsMenuOpen}
        onBlock={requestConfirm('block')}
        onFlag={requestConfirm('flag')}
      />

      <ConfirmDestructiveModal
        visible={pendingConfirm !== null}
        title={pendingConfirm ? CONFIRM_COPY[pendingConfirm].title : ''}
        description={
          pendingConfirm ? CONFIRM_COPY[pendingConfirm].description : ''
        }
        confirmLabel={
          pendingConfirm ? CONFIRM_COPY[pendingConfirm].confirmLabel : ''
        }
        onConfirm={handleConfirm}
        onCancel={() => setPendingConfirm(null)}
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
