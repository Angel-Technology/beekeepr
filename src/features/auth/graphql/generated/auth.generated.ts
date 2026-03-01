export type AuthUserDto = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthSessionDto = {
  accessToken: string;
  user: AuthUserDto;
};

export type SignInWithGoogleMutation = {
  signInWithGoogle: {
    ok: boolean;
    error?: string | null;
    session?: AuthSessionDto | null;
  };
};

export const SignInWithGoogleDocument = /* GraphQL */ `
  mutation SignInWithGoogle {
    signInWithGoogle {
      ok
      error
      session {
        accessToken
        user {
          id
          email
          name
        }
      }
    }
  }
`;

export type StartEmailSignUpMutationVariables = {
  email: string;
};

export type StartEmailSignUpMutation = {
  startEmailSignUp: {
    ok: boolean;
    error?: string | null;
  };
};

export const StartEmailSignUpDocument = /* GraphQL */ `
  mutation StartEmailSignUp($email: String!) {
    startEmailSignUp(email: $email) {
      ok
      error
    }
  }
`;
