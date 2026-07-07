import type { BackgroundCheckBadge } from '@features/auth';
import type {
  ContactVisibility,
  ProfileVisibility,
} from '@features/home/graphql/generated/home.generated';

/**
 * Preview-friendly subset of user fields shared by every drawer that
 * shows a profile (connection preview, invite preview, own profile,
 * search result preview). Both `UserConnectionDto` and `UserGraph`
 * satisfy this shape — list queries already hydrate everything thanks to
 * the expanded fragments, and `getCurrentUser` returns the same surface
 * (plus extras the preview ignores).
 *
 * Nullable fields accept `undefined` too so codegen fragment types
 * (which widen optionals to `T | null | undefined`) are assignable
 * as-is.
 */
export type ProfilePreviewUser = {
  id: string;
  nickname?: string | null;
  displayName?: string | null;
  handle?: string | null;
  imageUrl?: string | null;
  backgroundCheckBadge: BackgroundCheckBadge;
  backgroundCheckBadgeExpiresAtUtc?: string | null;
  checkrLastCheckAtUtc?: string | null;
  userCreatedAtUtc: string;
  profileVisibility: ProfileVisibility;
  contactVisibility: ContactVisibility;
  googleVoicePhone?: string | null;
  whatsAppPhone?: string | null;
  instagramHandle?: string | null;
  telegramHandle?: string | null;
  snapchatHandle?: string | null;
  signalPhone?: string | null;
};
