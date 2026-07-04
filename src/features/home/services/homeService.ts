import { homeRepository } from '../repository/homeRepository';
import type { BlockedUser, Connection, Invite } from '../models/home.types';

const DEFAULT_PAGE_SIZE = 50;

export const homeService = {
  /**
   * Lists the signed-in user's Buzz Badge connections (friends). Relay-style
   * cursor pagination is exposed on the backend; for now we pull a single
   * page sized by `DEFAULT_PAGE_SIZE` and return the nodes flat — the
   * connections card doesn't paginate today.
   */
  async listConnections(limit = DEFAULT_PAGE_SIZE): Promise<Connection[]> {
    const payload = await homeRepository.friends({ first: limit });
    return payload.friends?.nodes ?? [];
  },

  /**
   * Lists pending invites the user has received (other users who have sent
   * them a friend request). Each invite carries the requester's profile in
   * the same shape as a connection row.
   */
  async listIncomingInvites(limit = DEFAULT_PAGE_SIZE): Promise<Invite[]> {
    const payload = await homeRepository.incomingInvites({ first: limit });
    return payload.incomingFriendRequests?.nodes ?? [];
  },

  /**
   * Lists pending invites the user has sent (still awaiting the other
   * user's accept/decline). Same node shape as incoming invites.
   */
  async listOutgoingInvites(limit = DEFAULT_PAGE_SIZE): Promise<Invite[]> {
    const payload = await homeRepository.outgoingInvites({ first: limit });
    return payload.outgoingFriendRequests?.nodes ?? [];
  },

  /**
   * Lists users the signed-in user has blocked. Same node shape as
   * connections + invites.
   */
  async listBlockedUsers(limit = DEFAULT_PAGE_SIZE): Promise<BlockedUser[]> {
    const payload = await homeRepository.blockedUsers({ first: limit });
    return payload.blockedUsers?.nodes ?? [];
  },

  /**
   * Accepts the friend request from `otherUserId`. Returns nothing on
   * success; throws with the server `error` string when the backend
   * rejects (already accepted, request not found, etc.).
   */
  async acceptInvite(otherUserId: string): Promise<void> {
    const payload = await homeRepository.acceptInvite({
      input: { otherUserId },
    });
    if (payload.acceptFriendRequest.error) {
      throw new Error(payload.acceptFriendRequest.error);
    }
  },

  /**
   * Declines the friend request from `otherUserId`. Throws on server
   * error; resolves to `void` otherwise.
   */
  async declineInvite(otherUserId: string): Promise<void> {
    const payload = await homeRepository.declineInvite({
      input: { otherUserId },
    });
    if (payload.declineFriendRequest.error) {
      throw new Error(payload.declineFriendRequest.error);
    }
  },

  /**
   * Cancels a friend request the user previously sent to `otherUserId`.
   * Throws on server error; resolves to `void` otherwise.
   */
  async cancelInvite(otherUserId: string): Promise<void> {
    const payload = await homeRepository.cancelInvite({
      input: { otherUserId },
    });
    if (payload.cancelFriendRequest.error) {
      throw new Error(payload.cancelFriendRequest.error);
    }
  },

  /**
   * Sends a friend request to `targetUserId`. Throws on server error;
   * resolves to `void` otherwise. The mutation also returns the new
   * `FriendshipGraph.id` but callers don't need it — the relevant state
   * (the search row's `viewerFriendshipState`) flips to `REQUEST_SENT`
   * on the next refetch.
   */
  async sendInvite(targetUserId: string): Promise<void> {
    const payload = await homeRepository.sendInvite({
      input: { targetUserId },
    });
    if (payload.sendFriendRequest.error) {
      throw new Error(payload.sendFriendRequest.error);
    }
  },

  /**
   * Removes the block the user placed on `targetUserId`. Throws on server
   * error; resolves to `void` otherwise.
   */
  async unblockUser(targetUserId: string): Promise<void> {
    const payload = await homeRepository.unblockUser({
      input: { targetUserId },
    });
    if (payload.unblockUser.error) {
      throw new Error(payload.unblockUser.error);
    }
  },

  /**
   * Blocks `targetUserId`. The backend removes any friendship that
   * existed and adds `targetUserId` to the viewer's blocked list.
   * Throws on server error.
   */
  async blockUser(targetUserId: string): Promise<void> {
    const payload = await homeRepository.blockUser({
      input: { targetUserId },
    });
    if (payload.blockUser.error) {
      throw new Error(payload.blockUser.error);
    }
  },

  /**
   * Flags `targetUserId` for moderation review. Throws on server error.
   */
  async flagUser(targetUserId: string): Promise<void> {
    const payload = await homeRepository.flagUser({
      input: { targetUserId },
    });
    if (payload.flagUser.error) {
      throw new Error(payload.flagUser.error);
    }
  },

  /**
   * Removes the friendship with `otherUserId`. Throws on server error.
   */
  async removeFriend(otherUserId: string): Promise<void> {
    const payload = await homeRepository.removeFriend({
      input: { otherUserId },
    });
    if (payload.removeFriend.error) {
      throw new Error(payload.removeFriend.error);
    }
  },
};
