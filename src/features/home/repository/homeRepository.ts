import { executeGraphQL } from '@src/lib/graphql/client';
import {
  AcceptInviteDocument,
  BlockUserDocument,
  BlockedUsersDocument,
  CancelInviteDocument,
  DeclineInviteDocument,
  FlagUserDocument,
  FriendsDocument,
  IncomingInvitesDocument,
  OutgoingInvitesDocument,
  RemoveFriendDocument,
  SendInviteDocument,
  UnblockUserDocument,
  type AcceptInviteMutation,
  type AcceptInviteMutationVariables,
  type BlockUserMutation,
  type BlockUserMutationVariables,
  type BlockedUsersQuery,
  type BlockedUsersQueryVariables,
  type CancelInviteMutation,
  type CancelInviteMutationVariables,
  type DeclineInviteMutation,
  type DeclineInviteMutationVariables,
  type FlagUserMutation,
  type FlagUserMutationVariables,
  type FriendsQuery,
  type FriendsQueryVariables,
  type IncomingInvitesQuery,
  type IncomingInvitesQueryVariables,
  type OutgoingInvitesQuery,
  type OutgoingInvitesQueryVariables,
  type RemoveFriendMutation,
  type RemoveFriendMutationVariables,
  type SendInviteMutation,
  type SendInviteMutationVariables,
  type UnblockUserMutation,
  type UnblockUserMutationVariables,
} from '../graphql/generated/home.generated';

export const homeRepository = {
  friends(variables: FriendsQueryVariables) {
    return executeGraphQL<FriendsQuery, FriendsQueryVariables>({
      document: FriendsDocument,
      variables,
    });
  },
  incomingInvites(variables: IncomingInvitesQueryVariables) {
    return executeGraphQL<IncomingInvitesQuery, IncomingInvitesQueryVariables>({
      document: IncomingInvitesDocument,
      variables,
    });
  },
  outgoingInvites(variables: OutgoingInvitesQueryVariables) {
    return executeGraphQL<OutgoingInvitesQuery, OutgoingInvitesQueryVariables>({
      document: OutgoingInvitesDocument,
      variables,
    });
  },
  blockedUsers(variables: BlockedUsersQueryVariables) {
    return executeGraphQL<BlockedUsersQuery, BlockedUsersQueryVariables>({
      document: BlockedUsersDocument,
      variables,
    });
  },
  acceptInvite(variables: AcceptInviteMutationVariables) {
    return executeGraphQL<AcceptInviteMutation, AcceptInviteMutationVariables>({
      document: AcceptInviteDocument,
      variables,
    });
  },
  declineInvite(variables: DeclineInviteMutationVariables) {
    return executeGraphQL<
      DeclineInviteMutation,
      DeclineInviteMutationVariables
    >({
      document: DeclineInviteDocument,
      variables,
    });
  },
  cancelInvite(variables: CancelInviteMutationVariables) {
    return executeGraphQL<CancelInviteMutation, CancelInviteMutationVariables>({
      document: CancelInviteDocument,
      variables,
    });
  },
  sendInvite(variables: SendInviteMutationVariables) {
    return executeGraphQL<SendInviteMutation, SendInviteMutationVariables>({
      document: SendInviteDocument,
      variables,
    });
  },
  unblockUser(variables: UnblockUserMutationVariables) {
    return executeGraphQL<UnblockUserMutation, UnblockUserMutationVariables>({
      document: UnblockUserDocument,
      variables,
    });
  },
  blockUser(variables: BlockUserMutationVariables) {
    return executeGraphQL<BlockUserMutation, BlockUserMutationVariables>({
      document: BlockUserDocument,
      variables,
    });
  },
  flagUser(variables: FlagUserMutationVariables) {
    return executeGraphQL<FlagUserMutation, FlagUserMutationVariables>({
      document: FlagUserDocument,
      variables,
    });
  },
  removeFriend(variables: RemoveFriendMutationVariables) {
    return executeGraphQL<RemoveFriendMutation, RemoveFriendMutationVariables>({
      document: RemoveFriendDocument,
      variables,
    });
  },
};
