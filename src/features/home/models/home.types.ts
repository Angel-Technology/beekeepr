import type { UserConnectionFieldsFragment } from '../graphql/generated/home.generated';

// `friends`, `incomingFriendRequests`, `outgoingFriendRequests`, and
// `blockedUsers` all resolve to nodes of `UserConnectionDto`, so the same
// fragment shape powers every list row. Aliases per use case keep call
// sites readable.
export type Connection = UserConnectionFieldsFragment;
export type Invite = UserConnectionFieldsFragment;
export type BlockedUser = UserConnectionFieldsFragment;
