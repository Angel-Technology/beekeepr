import { executeGraphQL } from '@src/lib/graphql/client';
import {
  CurrentUserDocument,
  type CurrentUserQuery,
  RequestEmailSignInDocument,
  type RequestEmailSignInMutation,
  type RequestEmailSignInMutationVariables,
  SignInWithGoogleDocument,
  type SignInWithGoogleMutation,
  type SignInWithGoogleMutationVariables,
  SignOutDocument,
  type SignOutMutation,
  StartPersonaInquiryDocument,
  type StartPersonaInquiryMutation,
  VerifyEmailSignInDocument,
  type VerifyEmailSignInMutation,
  type VerifyEmailSignInMutationVariables,
} from '../graphql/generated/auth.generated';
import type {
  EmailVerificationRequestInput,
  GoogleSignInInput,
  VerifyEmailCodeInput,
} from '../models/auth.types';

export const authRepository = {
  requestEmailSignIn(input: EmailVerificationRequestInput) {
    return executeGraphQL<
      RequestEmailSignInMutation,
      RequestEmailSignInMutationVariables
    >({
      document: RequestEmailSignInDocument,
      variables: { input },
    });
  },

  verifyEmailSignIn(input: VerifyEmailCodeInput) {
    return executeGraphQL<
      VerifyEmailSignInMutation,
      VerifyEmailSignInMutationVariables
    >({
      document: VerifyEmailSignInDocument,
      variables: { input },
    });
  },

  signInWithGoogle(input: GoogleSignInInput) {
    return executeGraphQL<
      SignInWithGoogleMutation,
      SignInWithGoogleMutationVariables
    >({
      document: SignInWithGoogleDocument,
      variables: { input },
    });
  },

  signOut() {
    return executeGraphQL<SignOutMutation>({
      document: SignOutDocument,
    });
  },

  startPersonaInquiry() {
    return executeGraphQL<StartPersonaInquiryMutation>({
      document: StartPersonaInquiryDocument,
    });
  },

  getCurrentUser() {
    return executeGraphQL<CurrentUserQuery>({
      document: CurrentUserDocument,
    });
  },
};
