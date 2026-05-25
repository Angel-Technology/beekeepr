import type {
  ProfileFieldsFragment,
  UpdateProfileInput,
  UserSearchResultFieldsFragment,
} from '../graphql/generated/account.generated';

export type ProfileUser = ProfileFieldsFragment;
export type UpdateProfilePatch = UpdateProfileInput;
export type UserSearchResult = UserSearchResultFieldsFragment;

export type AccountDeletionState = {
  userId: string;
  deletedAtUtc: string | null;
};

export type FieldStatus = 'idle' | 'saving' | 'success' | 'error';

export type HandleAvailability = {
  available: boolean;
  reason?: string | null;
};
