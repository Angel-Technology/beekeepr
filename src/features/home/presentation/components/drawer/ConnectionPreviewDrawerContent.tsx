import { useState } from 'react';
import { Pressable, View } from 'react-native';
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
  APP_HEADER_HEIGHT,
  AppHeader,
  CompactButton,
  IconButton,
  ProfilePreviewBody,
  useConfirmDestructive,
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

const CONFIRM_BLOCK = {
  title: 'Block user?',
  description:
    "They won't be able to send invites or see your profile. You can unblock them from your settings later.",
  confirmLabel: 'Block',
} as const;

const CONFIRM_FLAG = {
  title: 'Flag user?',
  description:
    "Our team will review their account. We won't share that you flagged them.",
  confirmLabel: 'Flag',
} as const;

const CONFIRM_REMOVE = {
  title: 'Remove connection?',
  description:
    "They'll lose access to your shared contact info. You can re-invite them later.",
  confirmLabel: 'Remove',
} as const;

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

  const { remove: removeFriend } = useRemoveFriend();
  const { accept: acceptInvite, decline: declineInvite } = useRespondToInvite();
  const { cancel: cancelInvite } = useCancelInvite();
  const { send: sendInvite } = useSendInvite();
  const { unblock: unblockUser } = useUnblockUser();
  const { block: blockUser } = useBlockUser();
  const { flag: flagUser } = useFlagUser();
  const confirm = useConfirmDestructive();

  const closeDrawer = () => navigation.closeDrawer();

  const runAndClose = (action: (id: string) => void) => () => {
    action(user.id);
    closeDrawer();
  };

  // Wrap a destructive mutation in a confirm-then-fire flow. Closes
  // the kebab menu (if open), awaits the shared confirm modal, then
  // runs the action + closes the drawer only if the user confirmed.
  const confirmAndRun =
    (
      prompt: { title: string; description: string; confirmLabel: string },
      action: (id: string) => void,
    ) =>
    async () => {
      setIsActionsMenuOpen(false);
      const ok = await confirm(prompt);
      if (!ok) {
        return;
      }
      action(user.id);
      closeDrawer();
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
              onRemove={confirmAndRun(CONFIRM_REMOVE, removeFriend)}
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
              onPress={() => setIsActionsMenuOpen((prev) => !prev)}
            />
          </View>
        }
      />

      <ProfilePreviewBody
        user={user}
        onScrollBeginDrag={() => setIsActionsMenuOpen(false)}
      />

      {/* Outside-tap dismissal. Starts BELOW the header so the kebab
          stays tappable (toggling the menu off goes through the
          kebab's own `onPress`, not through this overlay). Rendered
          BEFORE the menu so the menu sits on top in RN's
          last-rendered-wins z order. */}
      {isActionsMenuOpen ? (
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={() => setIsActionsMenuOpen(false)}
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
        onBlock={confirmAndRun(CONFIRM_BLOCK, blockUser)}
        onFlag={confirmAndRun(CONFIRM_FLAG, flagUser)}
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
