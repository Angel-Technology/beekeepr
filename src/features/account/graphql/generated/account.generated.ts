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

export type AcceptTermsPayload = {
  __typename?: 'AcceptTermsPayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type AuthSessionGraph = {
  __typename?: 'AuthSessionGraph';
  expiresAtUtc: Scalars['DateTime']['output'];
  token: Scalars['String']['output'];
};

export enum BackgroundCheckBadge {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  None = 'NONE'
}

export type CancelAccountDeletionPayload = {
  __typename?: 'CancelAccountDeletionPayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
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

export enum IdentityVerificationStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Declined = 'DECLINED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  NeedsReview = 'NEEDS_REVIEW',
  NotStarted = 'NOT_STARTED',
  Pending = 'PENDING'
}

export enum PersonaInquiryStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Declined = 'DECLINED',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  NeedsReview = 'NEEDS_REVIEW',
  Pending = 'PENDING'
}

export type RequestAccountDeletionPayload = {
  __typename?: 'RequestAccountDeletionPayload';
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

export type StartInstantCriminalCheckInput = {
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type StartInstantCriminalCheckPayload = {
  __typename?: 'StartInstantCriminalCheckPayload';
  checkId?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  hasPossibleMatches?: Maybe<Scalars['Boolean']['output']>;
  profileId?: Maybe<Scalars['String']['output']>;
  resultCount?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type StartPersonaInquiryPayload = {
  __typename?: 'StartPersonaInquiryPayload';
  createdNewInquiry: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  identityVerificationStatus?: Maybe<IdentityVerificationStatus>;
  inquiryId?: Maybe<Scalars['String']['output']>;
  personaInquiryStatus?: Maybe<PersonaInquiryStatus>;
  sessionToken?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SubscriptionDto = {
  __typename?: 'SubscriptionDto';
  currentPeriodEndUtc?: Maybe<Scalars['DateTime']['output']>;
  entitlement?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  productId?: Maybe<Scalars['String']['output']>;
  status: SubscriptionStatus;
  store?: Maybe<SubscriptionStore>;
  willRenew?: Maybe<Scalars['Boolean']['output']>;
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  InGracePeriod = 'IN_GRACE_PERIOD',
  None = 'NONE',
  Trialing = 'TRIALING'
}

export enum SubscriptionStore {
  AppStore = 'APP_STORE',
  PlayStore = 'PLAY_STORE',
  Promotional = 'PROMOTIONAL',
  Stripe = 'STRIPE',
  Unknown = 'UNKNOWN'
}

export type UpdateProfileInput = {
  handle?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfilePayload = {
  __typename?: 'UpdateProfilePayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type UserGraph = {
  __typename?: 'UserGraph';
  backgroundCheckBadge: BackgroundCheckBadge;
  backgroundCheckBadgeExpiresAtUtc?: Maybe<Scalars['DateTime']['output']>;
  createdAtUtc: Scalars['DateTime']['output'];
  deletedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  handle?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  identityVerificationStatus: IdentityVerificationStatus;
  imageUrl?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  personaInquiryId?: Maybe<Scalars['String']['output']>;
  personaInquiryStatus?: Maybe<PersonaInquiryStatus>;
  personaVerifiedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  subscription: SubscriptionDto;
  termsAcceptedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  verifiedBirthdate?: Maybe<Scalars['String']['output']>;
  verifiedFirstName?: Maybe<Scalars['String']['output']>;
  verifiedLastName?: Maybe<Scalars['String']['output']>;
  verifiedLicenseState?: Maybe<Scalars['String']['output']>;
  verifiedMiddleName?: Maybe<Scalars['String']['output']>;
};

export type UserMutations = {
  __typename?: 'UserMutations';
  acceptTerms: AcceptTermsPayload;
  cancelAccountDeletion: CancelAccountDeletionPayload;
  createUser: CreateUserPayload;
  requestAccountDeletion: RequestAccountDeletionPayload;
  requestEmailSignIn: RequestEmailSignInPayload;
  signInWithGoogle: SignInWithGooglePayload;
  signOut: SignOutPayload;
  startInstantCriminalCheck: StartInstantCriminalCheckPayload;
  startPersonaInquiry: StartPersonaInquiryPayload;
  updateProfile: UpdateProfilePayload;
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


export type UserMutationsStartInstantCriminalCheckArgs = {
  input: StartInstantCriminalCheckInput;
};


export type UserMutationsUpdateProfileArgs = {
  input: UpdateProfileInput;
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

export type ProfileFieldsFragment = { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, imageUrl?: string | null };

export type CancelAccountDeletionMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelAccountDeletionMutation = { __typename?: 'UserMutations', cancelAccountDeletion: { __typename?: 'CancelAccountDeletionPayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, deletedAtUtc?: string | null } | null } };

export type RequestAccountDeletionMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestAccountDeletionMutation = { __typename?: 'UserMutations', requestAccountDeletion: { __typename?: 'RequestAccountDeletionPayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, deletedAtUtc?: string | null } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'UserMutations', updateProfile: { __typename?: 'UpdateProfilePayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, imageUrl?: string | null } | null } };

export const ProfileFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]} as unknown as DocumentNode<ProfileFieldsFragment, unknown>;
export const CancelAccountDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAtUtc"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CancelAccountDeletionMutation, CancelAccountDeletionMutationVariables>;
export const RequestAccountDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAtUtc"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<RequestAccountDeletionMutation, RequestAccountDeletionMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;