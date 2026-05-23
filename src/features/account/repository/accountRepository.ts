import { executeGraphQL } from '@src/lib/graphql/client';
import {
  CancelAccountDeletionDocument,
  RequestAccountDeletionDocument,
  UpdateProfileDocument,
  type CancelAccountDeletionMutation,
  type CancelAccountDeletionMutationVariables,
  type RequestAccountDeletionMutation,
  type RequestAccountDeletionMutationVariables,
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
};
