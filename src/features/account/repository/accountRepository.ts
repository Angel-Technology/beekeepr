import { executeGraphQL } from '@src/lib/graphql/client';
import {
  CancelAccountDeletionDocument,
  CheckHandleAvailabilityDocument,
  RedeemPromoCodeDocument,
  PushPlatform,
  RegisterPushTokenDocument,
  RequestAccountDeletionDocument,
  UnregisterPushTokenDocument,
  UpdateProfileDocument,
  type CancelAccountDeletionMutation,
  type CancelAccountDeletionMutationVariables,
  type CheckHandleAvailabilityQuery,
  type CheckHandleAvailabilityQueryVariables,
  type RedeemPromoCodeMutation,
  type RedeemPromoCodeMutationVariables,
  type RegisterPushTokenMutation,
  type RegisterPushTokenMutationVariables,
  type RequestAccountDeletionMutation,
  type RequestAccountDeletionMutationVariables,
  type UnregisterPushTokenMutation,
  type UnregisterPushTokenMutationVariables,
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
  // Map the caller's plain-string `platform` to the codegen enum here so
  // the service layer doesn't need to reach into `graphql/generated`
  // (feature-layer boundary rule) — and callers don't see the `I_OS`
  // codegen quirk.
  registerPushToken(input: { token: string; platform: 'ios' | 'android' }) {
    return executeGraphQL<
      RegisterPushTokenMutation,
      RegisterPushTokenMutationVariables
    >({
      document: RegisterPushTokenDocument,
      variables: {
        input: {
          token: input.token,
          platform:
            input.platform === 'ios' ? PushPlatform.IOs : PushPlatform.Android,
        },
      },
    });
  },
  unregisterPushToken(variables: UnregisterPushTokenMutationVariables) {
    return executeGraphQL<
      UnregisterPushTokenMutation,
      UnregisterPushTokenMutationVariables
    >({
      document: UnregisterPushTokenDocument,
      variables,
    });
  },
};
