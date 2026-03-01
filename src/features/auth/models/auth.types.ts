export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated';

export type AuthProvider = 'google' | 'email';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};

export type AuthResult =
  | {
      success: true;
      session?: AuthSession;
    }
  | {
      success: false;
      error: string;
    };
