import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  UUID: { input: string; output: string; }
};

export type AuthSessionGraph = {
  __typename?: 'AuthSessionGraph';
  expiresAtUtc: Scalars['DateTime']['output'];
  token: Scalars['String']['output'];
};

export type CreateUserInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};

export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type RequestEmailSignInInput = {
  email: Scalars['String']['input'];
};

export type RequestEmailSignInPayload = {
  __typename?: 'RequestEmailSignInPayload';
  email?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  expiresAtUtc?: Maybe<Scalars['DateTime']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SignInWithGoogleInput = {
  idToken: Scalars['String']['input'];
};

export type SignInWithGooglePayload = {
  __typename?: 'SignInWithGooglePayload';
  error?: Maybe<Scalars['String']['output']>;
  session?: Maybe<AuthSessionGraph>;
  user?: Maybe<UserGraph>;
};

export type SignOutPayload = {
  __typename?: 'SignOutPayload';
  success: Scalars['Boolean']['output'];
};

export type UserGraph = {
  __typename?: 'UserGraph';
  createdAtUtc: Scalars['DateTime']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
};

export type UserMutations = {
  __typename?: 'UserMutations';
  createUser: CreateUserPayload;
  requestEmailSignIn: RequestEmailSignInPayload;
  signInWithGoogle: SignInWithGooglePayload;
  signOut: SignOutPayload;
  verifyEmailSignIn: VerifyEmailSignInPayload;
};


export type UserMutationsCreateUserArgs = {
  input: CreateUserInput;
};


export type UserMutationsRequestEmailSignInArgs = {
  input: RequestEmailSignInInput;
};


export type UserMutationsSignInWithGoogleArgs = {
  input: SignInWithGoogleInput;
};


export type UserMutationsVerifyEmailSignInArgs = {
  input: VerifyEmailSignInInput;
};

export type UserQueries = {
  __typename?: 'UserQueries';
  currentUser?: Maybe<UserGraph>;
  userById?: Maybe<UserGraph>;
};


export type UserQueriesUserByIdArgs = {
  id: Scalars['UUID']['input'];
};

export type VerifyEmailSignInInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type VerifyEmailSignInPayload = {
  __typename?: 'VerifyEmailSignInPayload';
  error?: Maybe<Scalars['String']['output']>;
  session?: Maybe<AuthSessionGraph>;
  user?: Maybe<UserGraph>;
};

export type AuthSessionFieldsFragment = { __typename?: 'AuthSessionGraph', token: string, expiresAtUtc: string };

export type AuthUserFieldsFragment = { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, emailVerified: boolean, createdAtUtc: string };

export type RequestEmailSignInMutationVariables = Exact<{
  input: RequestEmailSignInInput;
}>;


export type RequestEmailSignInMutation = { __typename?: 'UserMutations', requestEmailSignIn: { __typename?: 'RequestEmailSignInPayload', success: boolean, email?: string | null, expiresAtUtc?: string | null, error?: string | null } };

export type SignInWithGoogleMutationVariables = Exact<{
  input: SignInWithGoogleInput;
}>;


export type SignInWithGoogleMutation = { __typename?: 'UserMutations', signInWithGoogle: { __typename?: 'SignInWithGooglePayload', error?: string | null, session?: { __typename?: 'AuthSessionGraph', token: string, expiresAtUtc: string } | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, emailVerified: boolean, createdAtUtc: string } | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'UserMutations', signOut: { __typename?: 'SignOutPayload', success: boolean } };

export type VerifyEmailSignInMutationVariables = Exact<{
  input: VerifyEmailSignInInput;
}>;


export type VerifyEmailSignInMutation = { __typename?: 'UserMutations', verifyEmailSignIn: { __typename?: 'VerifyEmailSignInPayload', error?: string | null, session?: { __typename?: 'AuthSessionGraph', token: string, expiresAtUtc: string } | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, emailVerified: boolean, createdAtUtc: string } | null } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'UserQueries', currentUser?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, emailVerified: boolean, createdAtUtc: string } | null };

export const AuthSessionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}}]} as unknown as DocumentNode<AuthSessionFieldsFragment, unknown>;
export const AuthUserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}}]}}]} as unknown as DocumentNode<AuthUserFieldsFragment, unknown>;
export const RequestEmailSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestEmailSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestEmailSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestEmailSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<RequestEmailSignInMutation, RequestEmailSignInMutationVariables>;
export const SignInWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignInWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInWithGoogleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthSessionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}}]}}]} as unknown as DocumentNode<SignInWithGoogleMutation, SignInWithGoogleMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const VerifyEmailSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmailSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyEmailSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmailSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthSessionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}}]}}]} as unknown as DocumentNode<VerifyEmailSignInMutation, VerifyEmailSignInMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;