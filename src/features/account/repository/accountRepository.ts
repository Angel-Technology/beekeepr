import { executeGraphQL } from '@src/lib/graphql/client';
import {
  CancelAccountDeletionDocument,
  RequestAccountDeletionDocument,
  SearchUsersDocument,
  UpdateProfileDocument,
  type CancelAccountDeletionMutation,
  type CancelAccountDeletionMutationVariables,
  type RequestAccountDeletionMutation,
  type RequestAccountDeletionMutationVariables,
  type SearchUsersQuery,
  type SearchUsersQueryVariables,
  type UpdateProfileMutation,
  type UpdateProfileMutationVariables,
} from '../graphql/generated/account.generated';
import type { UpdateProfilePatch } from '../models/account.types';

export const accountRepository = {
  updateProfile(input: UpdateProfilePatch) {
    return executeGraphQL<
      UpdateProfileMutation,
      UpdateProfileMutationVariables
    >({
      document: UpdateProfileDocument,
      variables: { input },
    });
  },
  requestAccountDeletion() {
    return executeGraphQL<
      RequestAccountDeletionMutation,
      RequestAccountDeletionMutationVariables
    >({
      document: RequestAccountDeletionDocument,
    });
  },
  cancelAccountDeletion() {
    return executeGraphQL<
      CancelAccountDeletionMutation,
      CancelAccountDeletionMutationVariables
    >({
      document: CancelAccountDeletionDocument,
    });
  },
  searchUsers(variables: SearchUsersQueryVariables) {
    return executeGraphQL<SearchUsersQuery, SearchUsersQueryVariables>({
      document: SearchUsersDocument,
      variables,
    });
  },
};
