import { Modal, Pressable, Text, View } from 'react-native';
import { Ban, Flag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themedColors, useThemedColor } from '@common';
import type { ReactNode } from 'react';

type ProfileActionsMenuProps = {
  visible: boolean;
  onDismiss: () => void;
  onBlock: () => void;
  onFlag: () => void;
};

const APP_HEADER_HEIGHT = 56;
const MENU_GAP = 4;

/**
 * Tiny custom dropdown anchored under the kebab in the connection
 * preview header. Backdrop dismisses on `onPressIn` per the spec — the
 * moment the user touches outside the menu, it closes (no waiting for
 * press end). Menu items themselves still use `onPress` so a drag-cancel
 * away from an item before press-end doesn't fire the action.
 */
export const ProfileActionsMenu = ({
  visible,
  onDismiss,
  onBlock,
  onFlag,
}: ProfileActionsMenuProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Backdrop captures taps outside the menu. `onPressIn` (not
          `onPress`) so dismissal fires the moment the finger lands. */}
      <Pressable className="flex-1" onPressIn={onDismiss}>
        <View
          className="bg-tk-bg-elevated-primary absolute w-[115px] gap-2 rounded-5 py-3"
          style={{
            top: insets.top + APP_HEADER_HEIGHT + MENU_GAP,
            right: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <MenuItem
            label="Block"
            icon={<Ban size={16} strokeWidth={2} color={iconColor} />}
            onPress={() => {
              onDismiss();
              onBlock();
            }}
          />
          <MenuItem
            label="Flag"
            icon={<Flag size={16} strokeWidth={2} color={iconColor} />}
            onPress={() => {
              onDismiss();
              onFlag();
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

type MenuItemProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
};

const MenuItem = ({ label, icon, onPress }: MenuItemProps) => (
  <Pressable
    onPress={onPress}
    className="min-h-7 w-full flex-row items-center gap-2 rounded-1 px-3 py-0"
  >
    {icon}
    <Text className="text-tk-text-primary flex-1 font-lexend-regular text-sm">
      {label}
    </Text>
  </Pressable>
);
