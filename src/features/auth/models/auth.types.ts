import type {
  AuthSessionFieldsFragment,
  AuthUserFieldsFragment,
  CreateUserInput as CreateUserInputGenerated,
  RequestEmailSignInInput,
  SignInWithAppleInput,
  SignInWithGoogleInput,
  VerifyEmailSignInInput,
} from '../graphql/generated/auth.generated';
import {
  BackgroundCheckBadge,
  ContactVisibility,
  IdentityVerificationStatus,
  PersonaInquiryStatus,
  ProfileVisibility,
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
export type AppleSignInInput = SignInWithAppleInput;
export type CreateUserInput = CreateUserInputGenerated;
export {
  BackgroundCheckBadge,
  ContactVisibility,
  IdentityVerificationStatus,
  PersonaInquiryStatus,
  ProfileVisibility,
};
