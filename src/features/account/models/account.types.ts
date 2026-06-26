import type {
  ProfileFieldsFragment,
  UpdateProfileInput,
} from '../graphql/generated/account.generated';

export type ProfileUser = ProfileFieldsFragment;
export type UpdateProfilePatch = UpdateProfileInput;

export type AccountDeletionState = {
  userId: string;
  deletedAtUtc: string | null;
};

export type FieldStatus = 'idle' | 'saving' | 'success' | 'error';

export type HandleAvailability = {
  available: boolean;
  reason?: string | null;
};
