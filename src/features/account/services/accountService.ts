import { accountRepository } from '../repository/accountRepository';
import type {
  AccountDeletionState,
  ProfileUser,
  UpdateProfilePatch,
  UserSearchResult,
} from '../models/account.types';

export const accountService = {
  /**
   * Sends a partial profile update to the backend. Only the fields the caller
   * includes are touched — empty strings are forwarded as-is so the caller
   * (the hook) decides whether blanks clear the value or are filtered out.
   *
   * @throws an Error carrying the server `error` string when the payload
   * comes back without a user.
   */
  async updateProfile(input: UpdateProfilePatch): Promise<ProfileUser> {
    const payload = await accountRepository.updateProfile(input);

    if (payload.updateProfile.error) {
      throw new Error(payload.updateProfile.error);
    }

    if (!payload.updateProfile.user) {
      throw new Error('Profile update succeeded but no user was returned.');
    }

    return payload.updateProfile.user;
  },

  /**
   * Schedules the current account for deletion. The backend marks the user
   * deactivated immediately and stamps `deletedAtUtc`; the user has 72 hours
   * to log back in and undo it. The caller is responsible for clearing the
   * local session afterward.
   *
   * @throws an Error carrying the server `error` string when deletion fails.
   */
  async requestAccountDeletion(): Promise<AccountDeletionState> {
    const payload = await accountRepository.requestAccountDeletion();

    if (payload.requestAccountDeletion.error) {
      throw new Error(payload.requestAccountDeletion.error);
    }

    if (!payload.requestAccountDeletion.user) {
      throw new Error('Account deletion succeeded but no user was returned.');
    }

    return {
      userId: payload.requestAccountDeletion.user.id,
      deletedAtUtc: payload.requestAccountDeletion.user.deletedAtUtc ?? null,
    };
  },

  /**
   * Reverses a pending deletion within the 72-hour window. Returns the new
   * deletion state (typically `deletedAtUtc: null`).
   *
   * @throws an Error carrying the server `error` string on failure.
   */
  async cancelAccountDeletion(): Promise<AccountDeletionState> {
    const payload = await accountRepository.cancelAccountDeletion();

    if (payload.cancelAccountDeletion.error) {
      throw new Error(payload.cancelAccountDeletion.error);
    }

    if (!payload.cancelAccountDeletion.user) {
      throw new Error(
        'Cancel account deletion succeeded but no user was returned.',
      );
    }

    return {
      userId: payload.cancelAccountDeletion.user.id,
      deletedAtUtc: payload.cancelAccountDeletion.user.deletedAtUtc ?? null,
    };
  },

  /**
   * Searches the user directory for matches against a nickname / handle /
   * pin. Returns up to `limit` results (default 10). Empty or
   * whitespace-only queries short-circuit to an empty list so we don't
   * waste a round-trip.
   */
  async searchUsers(query: string, limit = 10): Promise<UserSearchResult[]> {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return [];
    }

    const payload = await accountRepository.searchUsers({
      query: trimmed,
      first: limit,
    });

    return payload.searchUsers?.nodes ?? [];
  },
};
