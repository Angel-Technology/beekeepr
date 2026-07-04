import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  ProfilePreviewBody,
  type ProfilePreviewUser,
} from '@components';

type ProfileDrawerContentBodyProps = {
  /**
   * The memoized preview-friendly shape the connected wrapper
   * derives from `useAuthSession`. Nullable to cover the pre-resolve
   * state where the auth query hasn't returned yet — in that case the
   * body renders the header + banner chrome only.
   */
  previewUser: ProfilePreviewUser | null;
};

/**
 * Pure presentation body for the signed-in user's own profile preview
 * drawer. Owns the fixed chrome (app header + "This is how others see
 * you." banner) and delegates the scrolling profile card to the shared
 * `ProfilePreviewBody`.
 *
 * Reads no auth / query hooks — only `useSafeAreaInsets` for the header
 * top inset. The connected wrapper (`ProfileDrawerContent`) resolves
 * the auth session, maps `createdAtUtc` → `userCreatedAtUtc`, and
 * passes the resulting `ProfilePreviewUser` in. Stories render this
 * body directly with fixture users — no provider mocks needed.
 */
export const ProfileDrawerContentBody = ({
  previewUser,
}: ProfileDrawerContentBodyProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-tk-bg-primary">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="font-poppins-semiBold text-base text-tk-text-primary">
            Preview
          </Text>
        }
      />

      <View className="items-center bg-tk-alerts-success px-4 py-2">
        <Text className="font-lexend-regular text-base text-tk-text-primary-reversed">
          This is how others see you.
        </Text>
      </View>

      {previewUser ? <ProfilePreviewBody user={previewUser} /> : null}
    </View>
  );
};
