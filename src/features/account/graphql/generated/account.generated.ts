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

export type AcceptFriendRequestPayload = {
  __typename?: 'AcceptFriendRequestPayload';
  error?: Maybe<Scalars['String']['output']>;
  friendship?: Maybe<FriendshipGraph>;
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

export type BlockUserInput = {
  targetUserId: Scalars['UUID']['input'];
};

export type BlockUserPayload = {
  __typename?: 'BlockUserPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** A connection to a list of items. */
export type BlockedUsersConnection = {
  __typename?: 'BlockedUsersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BlockedUsersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserConnectionDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BlockedUsersEdge = {
  __typename?: 'BlockedUsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserConnectionDto;
};

export type CancelAccountDeletionPayload = {
  __typename?: 'CancelAccountDeletionPayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type CancelFriendRequestPayload = {
  __typename?: 'CancelFriendRequestPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export enum ContactVisibility {
  ConnectionsOnly = 'CONNECTIONS_ONLY',
  Private = 'PRIVATE'
}

export type CreateUserInput = {
  email: Scalars['String']['input'];
};

export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type DeclineFriendRequestPayload = {
  __typename?: 'DeclineFriendRequestPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type FlagUserInput = {
  targetUserId: Scalars['UUID']['input'];
};

export type FlagUserPayload = {
  __typename?: 'FlagUserPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** A connection to a list of items. */
export type FriendsConnection = {
  __typename?: 'FriendsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<FriendsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserConnectionDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type FriendsEdge = {
  __typename?: 'FriendsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserConnectionDto;
};

export type FriendshipGraph = {
  __typename?: 'FriendshipGraph';
  addresseeId: Scalars['UUID']['output'];
  createdAtUtc: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  requesterId: Scalars['UUID']['output'];
  respondedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  status: FriendshipStatus;
};

export enum FriendshipStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING'
}

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

/** A connection to a list of items. */
export type IncomingFriendRequestsConnection = {
  __typename?: 'IncomingFriendRequestsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<IncomingFriendRequestsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserConnectionDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IncomingFriendRequestsEdge = {
  __typename?: 'IncomingFriendRequestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserConnectionDto;
};

/** A connection to a list of items. */
export type OutgoingFriendRequestsConnection = {
  __typename?: 'OutgoingFriendRequestsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<OutgoingFriendRequestsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserConnectionDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type OutgoingFriendRequestsEdge = {
  __typename?: 'OutgoingFriendRequestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserConnectionDto;
};

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

export enum ProfileVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum PushPlatform {
  Android = 'ANDROID',
  IOs = 'I_OS'
}

export type RedeemPromoCodeInput = {
  code: Scalars['String']['input'];
};

export type RedeemPromoCodePayload = {
  __typename?: 'RedeemPromoCodePayload';
  error?: Maybe<Scalars['String']['output']>;
  subscription?: Maybe<SubscriptionDto>;
};

export type RegisterPushTokenInput = {
  platform: PushPlatform;
  token: Scalars['String']['input'];
};

export type RegisterPushTokenPayload = {
  __typename?: 'RegisterPushTokenPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type RemoveFriendInput = {
  otherUserId: Scalars['UUID']['input'];
};

export type RemoveFriendPayload = {
  __typename?: 'RemoveFriendPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

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

export type RespondToFriendRequestInput = {
  otherUserId: Scalars['UUID']['input'];
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

export type SendFriendRequestInput = {
  targetUserId: Scalars['UUID']['input'];
};

export type SendFriendRequestPayload = {
  __typename?: 'SendFriendRequestPayload';
  error?: Maybe<Scalars['String']['output']>;
  friendship?: Maybe<FriendshipGraph>;
};

export type SignInWithAppleInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  idToken: Scalars['String']['input'];
};

export type SignInWithApplePayload = {
  __typename?: 'SignInWithApplePayload';
  error?: Maybe<Scalars['String']['output']>;
  session?: Maybe<AuthSessionGraph>;
  user?: Maybe<UserGraph>;
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
  licenseState?: InputMaybe<Scalars['String']['input']>;
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

export type UnblockUserInput = {
  targetUserId: Scalars['UUID']['input'];
};

export type UnblockUserPayload = {
  __typename?: 'UnblockUserPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UnregisterPushTokenInput = {
  token: Scalars['String']['input'];
};

export type UnregisterPushTokenPayload = {
  __typename?: 'UnregisterPushTokenPayload';
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateProfileInput = {
  contactVisibility?: InputMaybe<ContactVisibility>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  googleVoicePhone?: InputMaybe<Scalars['String']['input']>;
  handle?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  instagramHandle?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  profileVisibility?: InputMaybe<ProfileVisibility>;
  signalPhone?: InputMaybe<Scalars['String']['input']>;
  snapchatHandle?: InputMaybe<Scalars['String']['input']>;
  telegramHandle?: InputMaybe<Scalars['String']['input']>;
  whatsAppPhone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfilePayload = {
  __typename?: 'UpdateProfilePayload';
  error?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserGraph>;
};

export type UserConnectionDto = {
  __typename?: 'UserConnectionDto';
  backgroundCheckBadge: BackgroundCheckBadge;
  backgroundCheckBadgeExpiresAtUtc?: Maybe<Scalars['DateTime']['output']>;
  checkrLastCheckAtUtc?: Maybe<Scalars['DateTime']['output']>;
  connectionCreatedAtUtc: Scalars['DateTime']['output'];
  contactVisibility: ContactVisibility;
  displayName?: Maybe<Scalars['String']['output']>;
  googleVoicePhone?: Maybe<Scalars['String']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  instagramHandle?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  profileVisibility: ProfileVisibility;
  signalPhone?: Maybe<Scalars['String']['output']>;
  snapchatHandle?: Maybe<Scalars['String']['output']>;
  telegramHandle?: Maybe<Scalars['String']['output']>;
  userCreatedAtUtc: Scalars['DateTime']['output'];
  whatsAppPhone?: Maybe<Scalars['String']['output']>;
};

export type UserGraph = {
  __typename?: 'UserGraph';
  backgroundCheckBadge: BackgroundCheckBadge;
  backgroundCheckBadgeExpiresAtUtc?: Maybe<Scalars['DateTime']['output']>;
  checkrLastCheckAtUtc?: Maybe<Scalars['DateTime']['output']>;
  contactVisibility: ContactVisibility;
  createdAtUtc: Scalars['DateTime']['output'];
  deletedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  googleVoicePhone?: Maybe<Scalars['String']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  identityVerificationStatus: IdentityVerificationStatus;
  imageUrl?: Maybe<Scalars['String']['output']>;
  instagramHandle?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  personaInquiryId?: Maybe<Scalars['String']['output']>;
  personaInquiryStatus?: Maybe<PersonaInquiryStatus>;
  personaVerifiedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  profileVisibility: ProfileVisibility;
  signalPhone?: Maybe<Scalars['String']['output']>;
  snapchatHandle?: Maybe<Scalars['String']['output']>;
  subscription: SubscriptionDto;
  telegramHandle?: Maybe<Scalars['String']['output']>;
  termsAcceptedAtUtc?: Maybe<Scalars['DateTime']['output']>;
  verifiedBirthdate?: Maybe<Scalars['String']['output']>;
  verifiedFirstName?: Maybe<Scalars['String']['output']>;
  verifiedLastName?: Maybe<Scalars['String']['output']>;
  verifiedLicenseState?: Maybe<Scalars['String']['output']>;
  verifiedMiddleName?: Maybe<Scalars['String']['output']>;
  whatsAppPhone?: Maybe<Scalars['String']['output']>;
};

export type UserMutations = {
  __typename?: 'UserMutations';
  acceptFriendRequest: AcceptFriendRequestPayload;
  acceptTerms: AcceptTermsPayload;
  blockUser: BlockUserPayload;
  cancelAccountDeletion: CancelAccountDeletionPayload;
  cancelFriendRequest: CancelFriendRequestPayload;
  createUser: CreateUserPayload;
  declineFriendRequest: DeclineFriendRequestPayload;
  flagUser: FlagUserPayload;
  redeemPromoCode: RedeemPromoCodePayload;
  registerPushToken: RegisterPushTokenPayload;
  removeFriend: RemoveFriendPayload;
  requestAccountDeletion: RequestAccountDeletionPayload;
  requestEmailSignIn: RequestEmailSignInPayload;
  sendFriendRequest: SendFriendRequestPayload;
  signInWithApple: SignInWithApplePayload;
  signInWithGoogle: SignInWithGooglePayload;
  signOut: SignOutPayload;
  startInstantCriminalCheck: StartInstantCriminalCheckPayload;
  startPersonaInquiry: StartPersonaInquiryPayload;
  unblockUser: UnblockUserPayload;
  unregisterPushToken: UnregisterPushTokenPayload;
  updateProfile: UpdateProfilePayload;
  verifyEmailSignIn: VerifyEmailSignInPayload;
};


export type UserMutationsAcceptFriendRequestArgs = {
  input: RespondToFriendRequestInput;
};


export type UserMutationsBlockUserArgs = {
  input: BlockUserInput;
};


export type UserMutationsCancelFriendRequestArgs = {
  input: RespondToFriendRequestInput;
};


export type UserMutationsCreateUserArgs = {
  input: CreateUserInput;
};


export type UserMutationsDeclineFriendRequestArgs = {
  input: RespondToFriendRequestInput;
};


export type UserMutationsFlagUserArgs = {
  input: FlagUserInput;
};


export type UserMutationsRedeemPromoCodeArgs = {
  input: RedeemPromoCodeInput;
};


export type UserMutationsRegisterPushTokenArgs = {
  input: RegisterPushTokenInput;
};


export type UserMutationsRemoveFriendArgs = {
  input: RemoveFriendInput;
};


export type UserMutationsRequestEmailSignInArgs = {
  input: RequestEmailSignInInput;
};


export type UserMutationsSendFriendRequestArgs = {
  input: SendFriendRequestInput;
};


export type UserMutationsSignInWithAppleArgs = {
  input: SignInWithAppleInput;
};


export type UserMutationsSignInWithGoogleArgs = {
  input: SignInWithGoogleInput;
};


export type UserMutationsStartInstantCriminalCheckArgs = {
  input: StartInstantCriminalCheckInput;
};


export type UserMutationsUnblockUserArgs = {
  input: UnblockUserInput;
};


export type UserMutationsUnregisterPushTokenArgs = {
  input: UnregisterPushTokenInput;
};


export type UserMutationsUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type UserMutationsVerifyEmailSignInArgs = {
  input: VerifyEmailSignInInput;
};

export type UserQueries = {
  __typename?: 'UserQueries';
  blockedUsers?: Maybe<BlockedUsersConnection>;
  checkHandleAvailability: HandleAvailabilityResult;
  currentUser?: Maybe<UserGraph>;
  friends?: Maybe<FriendsConnection>;
  incomingFriendRequests?: Maybe<IncomingFriendRequestsConnection>;
  outgoingFriendRequests?: Maybe<OutgoingFriendRequestsConnection>;
  searchUsers?: Maybe<SearchUsersConnection>;
  userById?: Maybe<UserGraph>;
};


export type UserQueriesBlockedUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserQueriesCheckHandleAvailabilityArgs = {
  handle: Scalars['String']['input'];
};


export type UserQueriesFriendsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserQueriesIncomingFriendRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserQueriesOutgoingFriendRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
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
  backgroundCheckBadgeExpiresAtUtc?: Maybe<Scalars['DateTime']['output']>;
  checkrLastCheckAtUtc?: Maybe<Scalars['DateTime']['output']>;
  contactVisibility: ContactVisibility;
  createdAtUtc: Scalars['DateTime']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  googleVoicePhone?: Maybe<Scalars['String']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  instagramHandle?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  profileVisibility: ProfileVisibility;
  signalPhone?: Maybe<Scalars['String']['output']>;
  snapchatHandle?: Maybe<Scalars['String']['output']>;
  telegramHandle?: Maybe<Scalars['String']['output']>;
  viewerFriendshipState: ViewerFriendshipState;
  whatsAppPhone?: Maybe<Scalars['String']['output']>;
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

export enum ViewerFriendshipState {
  Friends = 'FRIENDS',
  None = 'NONE',
  RequestReceived = 'REQUEST_RECEIVED',
  RequestSent = 'REQUEST_SENT'
}

export type ProfileFieldsFragment = { __typename?: 'UserGraph', id: string, email: string, nickname?: string | null, handle?: string | null, imageUrl?: string | null, googleVoicePhone?: string | null, whatsAppPhone?: string | null, instagramHandle?: string | null, telegramHandle?: string | null, snapchatHandle?: string | null, signalPhone?: string | null, profileVisibility: ProfileVisibility, contactVisibility: ContactVisibility };

export type CancelAccountDeletionMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelAccountDeletionMutation = { __typename?: 'UserMutations', cancelAccountDeletion: { __typename?: 'CancelAccountDeletionPayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, deletedAtUtc?: string | null } | null } };

export type RedeemPromoCodeMutationVariables = Exact<{
  input: RedeemPromoCodeInput;
}>;


export type RedeemPromoCodeMutation = { __typename?: 'UserMutations', redeemPromoCode: { __typename?: 'RedeemPromoCodePayload', error?: string | null } };

export type RegisterPushTokenMutationVariables = Exact<{
  input: RegisterPushTokenInput;
}>;


export type RegisterPushTokenMutation = { __typename?: 'UserMutations', registerPushToken: { __typename?: 'RegisterPushTokenPayload', error?: string | null, success: boolean } };

export type RequestAccountDeletionMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestAccountDeletionMutation = { __typename?: 'UserMutations', requestAccountDeletion: { __typename?: 'RequestAccountDeletionPayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, deletedAtUtc?: string | null } | null } };

export type UnregisterPushTokenMutationVariables = Exact<{
  input: UnregisterPushTokenInput;
}>;


export type UnregisterPushTokenMutation = { __typename?: 'UserMutations', unregisterPushToken: { __typename?: 'UnregisterPushTokenPayload', error?: string | null, success: boolean } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'UserMutations', updateProfile: { __typename?: 'UpdateProfilePayload', error?: string | null, user?: { __typename?: 'UserGraph', id: string, email: string, nickname?: string | null, handle?: string | null, imageUrl?: string | null, googleVoicePhone?: string | null, whatsAppPhone?: string | null, instagramHandle?: string | null, telegramHandle?: string | null, snapchatHandle?: string | null, signalPhone?: string | null, profileVisibility: ProfileVisibility, contactVisibility: ContactVisibility } | null } };

export type CheckHandleAvailabilityQueryVariables = Exact<{
  handle: Scalars['String']['input'];
}>;


export type CheckHandleAvailabilityQuery = { __typename?: 'UserQueries', checkHandleAvailability: { __typename?: 'HandleAvailabilityResult', available: boolean, reason?: string | null } };

export const ProfileFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleVoicePhone"}},{"kind":"Field","name":{"kind":"Name","value":"whatsAppPhone"}},{"kind":"Field","name":{"kind":"Name","value":"instagramHandle"}},{"kind":"Field","name":{"kind":"Name","value":"telegramHandle"}},{"kind":"Field","name":{"kind":"Name","value":"snapchatHandle"}},{"kind":"Field","name":{"kind":"Name","value":"signalPhone"}},{"kind":"Field","name":{"kind":"Name","value":"profileVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"contactVisibility"}}]}}]} as unknown as DocumentNode<ProfileFieldsFragment, unknown>;
export const CancelAccountDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAtUtc"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CancelAccountDeletionMutation, CancelAccountDeletionMutationVariables>;
export const RedeemPromoCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RedeemPromoCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RedeemPromoCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redeemPromoCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<RedeemPromoCodeMutation, RedeemPromoCodeMutationVariables>;
export const RegisterPushTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterPushToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterPushTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerPushToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RegisterPushTokenMutation, RegisterPushTokenMutationVariables>;
export const RequestAccountDeletionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAccountDeletion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAtUtc"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<RequestAccountDeletionMutation, RequestAccountDeletionMutationVariables>;
export const UnregisterPushTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnregisterPushToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnregisterPushTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unregisterPushToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UnregisterPushTokenMutation, UnregisterPushTokenMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGraph"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleVoicePhone"}},{"kind":"Field","name":{"kind":"Name","value":"whatsAppPhone"}},{"kind":"Field","name":{"kind":"Name","value":"instagramHandle"}},{"kind":"Field","name":{"kind":"Name","value":"telegramHandle"}},{"kind":"Field","name":{"kind":"Name","value":"snapchatHandle"}},{"kind":"Field","name":{"kind":"Name","value":"signalPhone"}},{"kind":"Field","name":{"kind":"Name","value":"profileVisibility"}},{"kind":"Field","name":{"kind":"Name","value":"contactVisibility"}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const CheckHandleAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckHandleAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"handle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkHandleAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"handle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"handle"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<CheckHandleAvailabilityQuery, CheckHandleAvailabilityQueryVariables>;