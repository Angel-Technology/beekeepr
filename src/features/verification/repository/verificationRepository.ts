import { executeGraphQL } from '@src/lib/graphql/client';
import {
  StartInstantCriminalCheckDocument,
  type StartInstantCriminalCheckMutation,
  type StartInstantCriminalCheckMutationVariables,
  StartPersonaInquiryDocument,
  type StartPersonaInquiryMutation,
} from '../graphql/generated/verification.generated';

export const verificationRepository = {
  startInstantCriminalCheck(
    input: StartInstantCriminalCheckMutationVariables['input'],
  ) {
    return executeGraphQL<
      StartInstantCriminalCheckMutation,
      StartInstantCriminalCheckMutationVariables
    >({
      document: StartInstantCriminalCheckDocument,
      variables: { input },
    });
  },

  startPersonaInquiry() {
    return executeGraphQL<StartPersonaInquiryMutation>({
      document: StartPersonaInquiryDocument,
    });
  },
};
