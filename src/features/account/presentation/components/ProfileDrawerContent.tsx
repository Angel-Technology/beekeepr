import { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  ProfilePreviewBody,
  type ProfilePreviewUser,
} from '@components';
import { useAuthSession } from '@features/auth';

/**
 * Right-side drawer content rendered for the signed-in user's own
 * profile preview. The body is the shared `ProfilePreviewBody` — same
 * component the connection preview uses. We only need to map the auth
 * user's `createdAtUtc` field name onto `userCreatedAtUtc` (the shape
 * connection rows use natively).
 *
 * The "This is how others see you." banner stays here since it's
 * specific to the own-profile context.
 */
export const ProfileDrawerContent = (_props: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();

  const previewUser = useMemo<ProfilePreviewUser | null>(() => {
    if (!user) {
      return null;
    }
    return {
      ...user,
      userCreatedAtUtc: user.createdAtUtc,
    };
  }, [user]);

  return (
    <View className="bg-tk-bg-primary flex-1">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="text-tk-text-primary font-poppins-semiBold text-base">
            Preview
          </Text>
        }
      />

      <View className="bg-tk-alerts-success items-center px-4 py-2">
        <Text className="text-tk-text-primary-reversed font-lexend-regular text-base">
          This is how others see you.
        </Text>
      </View>

      {previewUser ? <ProfilePreviewBody user={previewUser} /> : null}
    </View>
  );
};
