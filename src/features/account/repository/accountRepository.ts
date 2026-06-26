import { executeGraphQL } from '@src/lib/graphql/client';
import {
  CancelAccountDeletionDocument,
  CheckHandleAvailabilityDocument,
  RedeemPromoCodeDocument,
  RequestAccountDeletionDocument,
  UpdateProfileDocument,
  type CancelAccountDeletionMutation,
  type CancelAccountDeletionMutationVariables,
  type CheckHandleAvailabilityQuery,
  type CheckHandleAvailabilityQueryVariables,
  type RedeemPromoCodeMutation,
  type RedeemPromoCodeMutationVariables,
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
  redeemPromoCode(variables: RedeemPromoCodeMutationVariables) {
    return executeGraphQL<
      RedeemPromoCodeMutation,
      RedeemPromoCodeMutationVariables
    >({
      document: RedeemPromoCodeDocument,
      variables,
    });
  },
  checkHandleAvailability(variables: CheckHandleAvailabilityQueryVariables) {
    return executeGraphQL<
      CheckHandleAvailabilityQuery,
      CheckHandleAvailabilityQueryVariables
    >({
      document: CheckHandleAvailabilityDocument,
      variables,
    });
  },
};
