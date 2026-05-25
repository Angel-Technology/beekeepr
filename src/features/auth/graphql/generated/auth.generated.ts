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

export type HandleAvailabilityResult = {
  __typename?: 'HandleAvailabilityResult';
  available: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
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

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

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

/** A connection to a list of items. */
export type SearchUsersConnection = {
  __typename?: 'SearchUsersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SearchUsersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserSearchResultDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type SearchUsersEdge = {
  __typename?: 'SearchUsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserSearchResultDto;
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
  checkHandleAvailability: HandleAvailabilityResult;
  currentUser?: Maybe<UserGraph>;
  searchUsers?: Maybe<SearchUsersConnection>;
  userById?: Maybe<UserGraph>;
};


export type UserQueriesCheckHandleAvailabilityArgs = {
  handle: Scalars['String']['input'];
};


export type UserQueriesSearchUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type UserQueriesUserByIdArgs = {
  id: Scalars['UUID']['input'];
};

export type UserSearchResultDto = {
  __typename?: 'UserSearchResultDto';
  backgroundCheckBadge: BackgroundCheckBadge;
  createdAtUtc: Scalars['DateTime']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
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

export type AuthUserFieldsFragment = { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, emailVerified: boolean, createdAtUtc: string, identityVerificationStatus: IdentityVerificationStatus, personaInquiryId?: string | null, personaInquiryStatus?: PersonaInquiryStatus | null, personaVerifiedAtUtc?: string | null, verifiedFirstName?: string | null, verifiedMiddleName?: string | null, verifiedLastName?: string | null, verifiedBirthdate?: string | null, verifiedLicenseState?: string | null, phoneNumber?: string | null, imageUrl?: string | null, backgroundCheckBadge: BackgroundCheckBadge, backgroundCheckBadgeExpiresAtUtc?: string | null, termsAcceptedAtUtc?: string | null };

export type AcceptTermsMutationVariables = Exact<{ [key: string]: never; }>;


export type AcceptTermsMutation = { __typename?: 'UserMutations', acceptTerms: { __typename?: 'AcceptTermsPayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, emailVerified: boolean, createdAtUtc: string, identityVerificationStatus: IdentityVerificationStatus, personaInquiryId?: string | null, personaInquiryStatus?: PersonaInquiryStatus | null, personaVerifiedAtUtc?: string | null, verifiedFirstName?: string | null, verifiedMiddleName?: string | null, verifiedLastName?: string | null, verifiedBirthdate?: string | null, verifiedLicenseState?: string | null, phoneNumber?: string | null, imageUrl?: string | null, backgroundCheckBadge: BackgroundCheckBadge, backgroundCheckBadgeExpiresAtUtc?: string | null, termsAcceptedAtUtc?: string | null } | null } };

export type RequestEmailSignInMutationVariables = Exact<{
  input: RequestEmailSignInInput;
}>;


export type RequestEmailSignInMutation = { __typename?: 'UserMutations', requestEmailSignIn: { __typename?: 'RequestEmailSignInPayload', success: boolean, email?: string | null, expiresAtUtc?: string | null, error?: string | null } };

export type SignInWithGoogleMutationVariables = Exact<{
  input: SignInWithGoogleInput;
}>;


export type SignInWithGoogleMutation = { __typename?: 'UserMutations', signInWithGoogle: { __typename?: 'SignInWithGooglePayload', error?: string | null, session?: { __typename?: 'AuthSessionGraph', token: string, expiresAtUtc: string } | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, emailVerified: boolean, createdAtUtc: string, identityVerificationStatus: IdentityVerificationStatus, personaInquiryId?: string | null, personaInquiryStatus?: PersonaInquiryStatus | null, personaVerifiedAtUtc?: string | null, verifiedFirstName?: string | null, verifiedMiddleName?: string | null, verifiedLastName?: string | null, verifiedBirthdate?: string | null, verifiedLicenseState?: string | null, phoneNumber?: string | null, imageUrl?: string | null, backgroundCheckBadge: BackgroundCheckBadge, backgroundCheckBadgeExpiresAtUtc?: string | null, termsAcceptedAtUtc?: string | null } | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'UserMutations', signOut: { __typename?: 'SignOutPayload', success: boolean } };

export type VerifyEmailSignInMutationVariables = Exact<{
  input: VerifyEmailSignInInput;
}>;


export type VerifyEmailSignInMutation = { __typename?: 'UserMutations', verifyEmailSignIn: { __typename?: 'VerifyEmailSignInPayload', error?: string | null, session?: { __typename?: 'AuthSessionGraph', token: string, expiresAtUtc: string } | null, user?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, emailVerified: boolean, createdAtUtc: string, identityVerificationStatus: IdentityVerificationStatus, personaInquiryId?: string | null, personaInquiryStatus?: PersonaInquiryStatus | null, personaVerifiedAtUtc?: string | null, verifiedFirstName?: string | null, verifiedMiddleName?: string | null, verifiedLastName?: string | null, verifiedBirthdate?: string | null, verifiedLicenseState?: string | null, phoneNumber?: string | null, imageUrl?: string | null, backgroundCheckBadge: BackgroundCheckBadge, backgroundCheckBadgeExpiresAtUtc?: string | null, termsAcceptedAtUtc?: string | null } | null } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'UserQueries', currentUser?: { __typename?: 'UserGraph', id: string, email: string, displayName?: string | null, nickname?: string | null, handle?: string | null, emailVerified: boolean, createdAtUtc: string, identityVerificationStatus: IdentityVerificationStatus, personaInquiryId?: string | null, personaInquiryStatus?: PersonaInquiryStatus | null, personaVerifiedAtUtc?: string | null, verifiedFirstName?: string | null, verifiedMiddleName?: string | null, verifiedLastName?: string | null, verifiedBirthdate?: string | null, verifiedLicenseState?: string | null, phoneNumber?: string | null, imageUrl?: string | null, backgroundCheckBadge: BackgroundCheckBadge, backgroundCheckBadgeExpiresAtUtc?: string | null, termsAcceptedAtUtc?: string | null } | null };

export const AuthSessionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}}]} as unknown as DocumentNode<AuthSessionFieldsFragment, unknown>;
export const AuthUserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"identityVerificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryId"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaVerifiedAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedMiddleName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLastName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedBirthdate"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLicenseState"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadge"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadgeExpiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"termsAcceptedAtUtc"}}]}}]} as unknown as DocumentNode<AuthUserFieldsFragment, unknown>;
export const AcceptTermsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"identityVerificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryId"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaVerifiedAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedMiddleName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLastName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedBirthdate"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLicenseState"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadge"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadgeExpiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"termsAcceptedAtUtc"}}]}}]} as unknown as DocumentNode<AcceptTermsMutation, AcceptTermsMutationVariables>;
export const RequestEmailSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestEmailSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestEmailSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestEmailSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<RequestEmailSignInMutation, RequestEmailSignInMutationVariables>;
export const SignInWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignInWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInWithGoogleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthSessionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"identityVerificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryId"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaVerifiedAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedMiddleName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLastName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedBirthdate"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLicenseState"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadge"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadgeExpiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"termsAcceptedAtUtc"}}]}}]} as unknown as DocumentNode<SignInWithGoogleMutation, SignInWithGoogleMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const VerifyEmailSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmailSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyEmailSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmailSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"session"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthSessionFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthSessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthSessionGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAtUtc"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"identityVerificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryId"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaVerifiedAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedMiddleName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLastName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedBirthdate"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLicenseState"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadge"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadgeExpiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"termsAcceptedAtUtc"}}]}}]} as unknown as DocumentNode<VerifyEmailSignInMutation, VerifyEmailSignInMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"identityVerificationStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryId"}},{"kind":"Field","name":{"kind":"Name","value":"personaInquiryStatus"}},{"kind":"Field","name":{"kind":"Name","value":"personaVerifiedAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedMiddleName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLastName"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedBirthdate"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedLicenseState"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadge"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundCheckBadgeExpiresAtUtc"}},{"kind":"Field","name":{"kind":"Name","value":"termsAcceptedAtUtc"}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;