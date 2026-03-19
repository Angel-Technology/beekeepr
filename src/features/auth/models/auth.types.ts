import type {
  AuthSessionFieldsFragment,
  AuthUserFieldsFragment,
  RequestEmailSignInInput,
  SignInWithGoogleInput,
  VerifyEmailSignInInput,
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
