import { accountRepository } from '../repository/accountRepository';
import type { ProfileUser, UpdateProfilePatch } from '../models/account.types';

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
};
