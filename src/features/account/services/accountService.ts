import { accountRepository } from '../repository/accountRepository';
import type {
  AccountDeletionState,
  HandleAvailability,
  ProfileUser,
  UpdateProfilePatch,
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
   * Redeems a promotional code against the signed-in user. Server validates
   * the code (existence, expiry, redemption cap, eligibility) — empty
   * strings short-circuit before the network hop. On success the caller is
   * responsible for refreshing RevenueCat so the new entitlement reflects
   * locally.
   *
   * @throws an Error carrying the server `error` string when the code is
   * invalid, expired, already-redeemed, or otherwise rejected.
   */
  async redeemPromoCode(code: string): Promise<void> {
    const normalized = code.trim();
    if (normalized.length === 0) {
      throw new Error('Enter a promo code to redeem.');
    }

    const payload = await accountRepository.redeemPromoCode({
      input: { code: normalized },
    });

    if (payload.redeemPromoCode.error) {
      throw new Error(payload.redeemPromoCode.error);
    }
  },

  /**
   * Checks whether a handle is free to claim. Backend authoritatively
   * decides — this just normalises (strip `@`, trim, lowercase) before
   * sending. Callers should already have run local format validation;
   * an empty handle short-circuits to "unavailable" so we don't burn a
   * network round-trip.
   */
  async checkHandleAvailability(handle: string): Promise<HandleAvailability> {
    const normalized = handle.replace(/^@+/, '').trim().toLowerCase();
    if (normalized.length === 0) {
      return { available: false, reason: 'Handle is required.' };
    }

    const payload = await accountRepository.checkHandleAvailability({
      handle: normalized,
    });

    return {
      available: payload.checkHandleAvailability.available,
      reason: payload.checkHandleAvailability.reason ?? null,
    };
  },

  /**
   * Persists the device's push token against the signed-in user so the
   * backend can target them. Idempotent on the server side — re-posting
   * the same token is a no-op and refreshes `last_seen_at`.
   *
   * `platform` is the `react-native` `Platform.OS` string; the repository
   * maps it to the backend's `PushPlatform` enum so callers don't see the
   * `I_OS` codegen quirk (and services stay clear of `graphql/generated`).
   */
  async registerPushToken(
    token: string,
    platform: 'ios' | 'android',
  ): Promise<void> {
    const payload = await accountRepository.registerPushToken({
      token,
      platform,
    });
    if (payload.registerPushToken.error) {
      throw new Error(payload.registerPushToken.error);
    }
  },

  /**
   * Drops a device token from the signed-in user. Call on sign-out so
   * the backend doesn't push to a device that no longer belongs to the
   * account.
   */
  async unregisterPushToken(token: string): Promise<void> {
    const payload = await accountRepository.unregisterPushToken({
      input: { token },
    });
    if (payload.unregisterPushToken.error) {
      throw new Error(payload.unregisterPushToken.error);
    }
  },
};
