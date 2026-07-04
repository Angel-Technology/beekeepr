import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import {
  ContactVisibility,
  ProfileVisibility,
  useAuthSession,
} from '@features/auth';
import { useContactForm } from '../../hooks/useContactForm';
import { useProfileForm } from '../../hooks/useProfileForm';
import { ProfileBody } from '../components/ProfileBody';

/**
 * Connected wrapper for the My Profile screen. Pulls the auth session,
 * both form hooks (`useProfileForm` + `useContactForm`), the router, and
 * the parent navigator (to open the profile-preview drawer); hands them
 * to `ProfileBody`.
 *
 * The two form hooks each own their own state, mutation, and cache
 * merge; this wrapper just adapts their `setX` names onto the body's
 * `onX` prop convention and boxes them into `profileForm` /
 * `contactForm` bundles so the body's signature stays scannable.
 *
 * Why a thin wrapper: keeps the body renderable under Storybook without
 * mocking `useRouter`, `useNavigation`, TanStack Query, or the auth
 * session — the same pattern verification uses.
 */
export const ProfileScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { data: user } = useAuthSession();
  const profileForm = useProfileForm(user ?? null);
  const contactForm = useContactForm(user ?? null);

  const profileShared =
    profileForm.profileVisibility === ProfileVisibility.Public;
  // Connections is now the only contact-share switch — the "Everyone"
  // public option was dropped per product and the enum value with it.
  // Off → `Private`, on → `ConnectionsOnly`.
  const connectionsOn =
    profileForm.contactVisibility === ContactVisibility.ConnectionsOnly;

  return (
    <ProfileBody
      profileForm={{
        values: profileForm.values,
        fieldStatus: profileForm.fieldStatus,
        setField: profileForm.setField,
        submitField: profileForm.submitField,
      }}
      contactForm={{
        values: contactForm.values,
        fieldStatus: contactForm.fieldStatus,
        fieldError: contactForm.fieldError,
        setField: contactForm.setField,
        submitField: contactForm.submitField,
      }}
      imageUrl={profileForm.imageUrl}
      profileShared={profileShared}
      connectionsOn={connectionsOn}
      onGoBack={() => router.back()}
      onOpenProfileDrawer={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}
      onSelectAvatar={profileForm.setImageUrl}
      onProfileSharedChange={(next) =>
        profileForm.setProfileVisibility(
          next ? ProfileVisibility.Public : ProfileVisibility.Private,
        )
      }
      onConnectionsChange={(next) =>
        profileForm.setContactVisibility(
          next ? ContactVisibility.ConnectionsOnly : ContactVisibility.Private,
        )
      }
    />
  );
};
