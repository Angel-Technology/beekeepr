import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useConfirmDestructive, type ProfilePreviewUser } from '@components';
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
import { ConnectionPreviewDrawerContentBody } from './ConnectionPreviewDrawerContentBody';

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
 * Connected wrapper for the right-side connection-preview drawer. Runs
 * the seven friendship-mutation hooks plus `useConfirmDestructive`,
 * wires each header / kebab action into a callback bundle, and forwards
 * everything into `ConnectionPreviewDrawerContentBody` for rendering.
 *
 * Reversible actions (Approve, Decline, Unsend, Unblock, Invite) fire
 * the mutation and immediately close the drawer. Destructive actions
 * (Block, Flag, Remove) route through the shared confirm modal first —
 * the confirm resolves to a boolean, and only a `true` proceeds to the
 * mutation + drawer close.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the drawer looks like, and Storybook renders that body directly.
 * Splitting the connected mutations out of the presentation surface
 * means there's no parallel preview composition to keep in sync — same
 * pixels in production and in stories, minus the router / GraphQL
 * providers Storybook can't run.
 */
export const ConnectionPreviewDrawerContent = ({
  navigation,
  user,
  source,
  friendshipState,
}: ConnectionPreviewDrawerContentProps) => {
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

  // Wrap a destructive mutation in a confirm-then-fire flow. Awaits the
  // shared confirm modal, then runs the action + closes the drawer only
  // if the user confirmed.
  const confirmAndRun =
    (
      prompt: { title: string; description: string; confirmLabel: string },
      action: (id: string) => void,
    ) =>
    async () => {
      const ok = await confirm(prompt);
      if (!ok) {
        return;
      }
      action(user.id);
      closeDrawer();
    };

  return (
    <ConnectionPreviewDrawerContentBody
      user={user}
      source={source}
      friendshipState={friendshipState}
      onClose={closeDrawer}
      onRemove={confirmAndRun(CONFIRM_REMOVE, removeFriend)}
      onAccept={runAndClose(acceptInvite)}
      onDecline={runAndClose(declineInvite)}
      onUnsend={runAndClose(cancelInvite)}
      onUnblock={runAndClose(unblockUser)}
      onSendInvite={runAndClose(sendInvite)}
      onBlock={confirmAndRun(CONFIRM_BLOCK, blockUser)}
      onFlag={confirmAndRun(CONFIRM_FLAG, flagUser)}
    />
  );
};
