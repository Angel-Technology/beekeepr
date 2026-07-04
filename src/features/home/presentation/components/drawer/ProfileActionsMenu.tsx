import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ban, Flag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themedColors, useThemedColor } from '@common';

type ProfileActionsMenuProps = {
  visible: boolean;
  onBlock: () => void;
  onFlag: () => void;
};

const APP_HEADER_HEIGHT = 56;
const MENU_GAP = 4;

/**
 * Inline dropdown anchored under the kebab in the connection-preview
 * header. Render-only — dismissal is owned by the parent
 * (`ConnectionPreviewDrawerContent`), which uses a touch-capture handler
 * on its outer wrapper to close on touch START anywhere outside the
 * menu, and a `onScrollBeginDrag` on the body's ScrollView to close on
 * scroll start. The menu items themselves still use `onPress` so a
 * drag-cancel away from an item before press-end doesn't fire the action.
 */
export const ProfileActionsMenu = ({
  visible,
  onBlock,
  onFlag,
}: ProfileActionsMenuProps) => {
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);

  if (!visible) {
    return null;
  }

  return (
    <View
      className="absolute w-[115px] gap-2 rounded-5 bg-tk-bg-elevated-primary py-3"
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
        onPress={onBlock}
      />
      <MenuItem
        label="Flag"
        icon={<Flag size={16} strokeWidth={2} color={iconColor} />}
        onPress={onFlag}
      />
    </View>
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
    <Text className="flex-1 font-lexend-regular text-sm text-tk-text-primary">
      {label}
    </Text>
  </Pressable>
);
