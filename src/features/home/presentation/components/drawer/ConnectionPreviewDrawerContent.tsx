import { useState } from 'react';
import { View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  ChevronLeft,
  EllipsisVertical,
  Trash,
  X,
} from 'lucide-react-native';
import {
  AppHeader,
  CompactButton,
  IconButton,
  ProfilePreviewBody,
  VerticalSpacer,
  type ProfilePreviewUser,
} from '@components';
import { cn, themedColors, useThemedColor } from '@common';
import { useBlockUser } from '../../../hooks/useBlockUser';
import { useCancelInvite } from '../../../hooks/useCancelInvite';
import { useFlagUser } from '../../../hooks/useFlagUser';
import { useRemoveFriend } from '../../../hooks/useRemoveFriend';
import { useRespondToInvite } from '../../../hooks/useRespondToInvite';
import { useUnblockUser } from '../../../hooks/useUnblockUser';
import type { PreviewSource } from '../../../state/drawerPreviewStore';
import { ProfileActionsMenu } from './ProfileActionsMenu';

type ConnectionPreviewDrawerContentProps = DrawerContentComponentProps & {
  user: ProfilePreviewUser;
  source: PreviewSource | null;
};

/**
 * Right-side drawer content rendered when a card row is tapped. Body is
 * the shared `ProfilePreviewBody`; the header actions vary by source:
 *
 * - `connection` → Remove (friend)
 * - `invite` → Decline + Approve
 * - `sent-invite` → Unsend
 * - `blocked` → Unblock
 *
 * The kebab dropdown (Block / Flag) is available on every source. Each
 * action dismisses the drawer once the mutation kicks off — the
 * invalidation in the hook drops the row from the underlying list.
 */
export const ConnectionPreviewDrawerContent = ({
  navigation,
  user,
  source,
}: ConnectionPreviewDrawerContentProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  const { remove: removeFriend } = useRemoveFriend();
  const { accept: acceptInvite, decline: declineInvite } = useRespondToInvite();
  const { cancel: cancelInvite } = useCancelInvite();
  const { unblock: unblockUser } = useUnblockUser();
  const { block: blockUser } = useBlockUser();
  const { flag: flagUser } = useFlagUser();

  const closeDrawer = () => navigation.closeDrawer();

  const runAndClose = (action: (id: string) => void) => () => {
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
              iconColor={iconColor}
              onRemove={runAndClose(removeFriend)}
              onAccept={runAndClose(acceptInvite)}
              onDecline={runAndClose(declineInvite)}
              onUnsend={runAndClose(cancelInvite)}
              onUnblock={runAndClose(unblockUser)}
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
              onPress={() => setIsActionsMenuOpen(true)}
            />
          </View>
        }
      />
      <VerticalSpacer />

      <ProfilePreviewBody user={user} />

      <ProfileActionsMenu
        visible={isActionsMenuOpen}
        onDismiss={() => setIsActionsMenuOpen(false)}
        onBlock={runAndClose(blockUser)}
        onFlag={runAndClose(flagUser)}
      />
    </View>
  );
};

type SourceActionsProps = {
  source: PreviewSource | null;
  iconColor: string;
  onRemove: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onUnsend: () => void;
  onUnblock: () => void;
};

const SourceActions = ({
  source,
  iconColor,
  onRemove,
  onAccept,
  onDecline,
  onUnsend,
  onUnblock,
}: SourceActionsProps) => {
  if (source === 'invite') {
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
  }
  if (source === 'sent-invite') {
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
  }
  if (source === 'blocked') {
    return (
      <CompactButton
        label="Unblock"
        variant="outline"
        iconLeft={<Check size={16} strokeWidth={2.2} color={iconColor} />}
        onPress={onUnblock}
        className="min-h-0 self-auto px-3 py-2"
        textClassName="text-sm"
      />
    );
  }
  // Default + 'connection' both render the Remove button.
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
};
