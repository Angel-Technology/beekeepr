import { executeGraphQL } from '@src/lib/graphql/client';
import {
  AcceptInviteDocument,
  BlockedUsersDocument,
  CancelInviteDocument,
  DeclineInviteDocument,
  FriendsDocument,
  IncomingInvitesDocument,
  OutgoingInvitesDocument,
  UnblockUserDocument,
  type AcceptInviteMutation,
  type AcceptInviteMutationVariables,
  type BlockedUsersQuery,
  type BlockedUsersQueryVariables,
  type CancelInviteMutation,
  type CancelInviteMutationVariables,
  type DeclineInviteMutation,
  type DeclineInviteMutationVariables,
  type FriendsQuery,
  type FriendsQueryVariables,
  type IncomingInvitesQuery,
  type IncomingInvitesQueryVariables,
  type OutgoingInvitesQuery,
  type OutgoingInvitesQueryVariables,
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
    return executeGraphQL<DeclineInviteMutation, DeclineInviteMutationVariables>({
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
  unblockUser(variables: UnblockUserMutationVariables) {
    return executeGraphQL<UnblockUserMutation, UnblockUserMutationVariables>({
      document: UnblockUserDocument,
      variables,
    });
  },
};
