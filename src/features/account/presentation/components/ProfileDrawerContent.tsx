import { useMemo } from 'react';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import type { ProfilePreviewUser } from '@components';
import { useAuthSession } from '@features/auth';
import { ProfileDrawerContentBody } from './ProfileDrawerContentBody';

/**
 * Connected wrapper for the right-side drawer that shows the signed-in
 * user's own profile preview. Reads the current user via
 * `useAuthSession`, reshapes it to the `ProfilePreviewUser` surface the
 * shared preview body expects, and passes it into
 * `ProfileDrawerContentBody` for rendering.
 *
 * Why the reshape: `useAuthSession` returns the auth user with a
 * `createdAtUtc` field, but every other consumer of `ProfilePreviewBody`
 * (connection rows, search results) uses `userCreatedAtUtc` — that's
 * the field name on the connection / search fragments. Mapping here
 * keeps the shared body agnostic of which query hydrated the user.
 *
 * Why a thin wrapper: the body's JSX is the source of truth for what
 * the drawer looks like, and Storybook renders that body directly.
 * Extracting the auth read means there's no parallel preview
 * composition to keep in sync — same pixels in production and stories.
 */
export const ProfileDrawerContent = (_props: DrawerContentComponentProps) => {
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

  return <ProfileDrawerContentBody previewUser={previewUser} />;
};
