import type {
  AuthSessionFieldsFragment,
  AuthUserFieldsFragment,
  RequestEmailSignInInput,
  SignInWithGoogleInput,
  StartPersonaInquiryPayload,
  VerifyEmailSignInInput,
} from '../graphql/generated/auth.generated';
import {
  IdentityVerificationStatus,
  PersonaInquiryStatus,
} from '../graphql/generated/auth.generated';

export type AuthUser = AuthUserFieldsFragment;
export type AuthSession = AuthSessionFieldsFragment;
export type AuthCredentials = {
  session: AuthSession;
  user: AuthUser;
};

export type EmailVerificationRequestInput = RequestEmailSignInInput;
export type VerifyEmailCodeInput = VerifyEmailSignInInput;
export type GoogleSignInInput = SignInWithGoogleInput;
export type PersonaInquiryStartResult = StartPersonaInquiryPayload;
export { IdentityVerificationStatus, PersonaInquiryStatus };
