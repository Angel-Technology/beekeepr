import { executeGraphQL } from '@src/lib/graphql/client';
import {
  UpdateProfileDocument,
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
};
