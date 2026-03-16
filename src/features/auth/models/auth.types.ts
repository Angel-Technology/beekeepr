import type {
  AuthUserFieldsFragment,
  CurrentUserQuery,
  RequestEmailSignInInput,
  SignInWithGoogleInput,
  VerifyEmailSignInInput,
} from '../graphql/generated/auth.generated';

export type AuthUser = AuthUserFieldsFragment;

// The backend currently returns authenticated user state, not a separate session object.
export type AuthSession = NonNullable<CurrentUserQuery['currentUser']>;

export type EmailVerificationRequestInput = RequestEmailSignInInput;
export type VerifyEmailCodeInput = VerifyEmailSignInInput;
export type GoogleSignInInput = SignInWithGoogleInput;
