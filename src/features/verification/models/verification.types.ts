import type {
  IdentityVerificationStatus,
  PersonaInquiryStatus,
  StartInstantCriminalCheckMutation,
  StartInstantCriminalCheckMutationVariables,
  StartPersonaInquiryPayload,
} from '../graphql/generated/verification.generated';

export type StartVerificationInput = {
  inquiryId: string;
  sessionToken?: string;
  referenceId?: string;
};

export type VerificationLaunchResult = {
  inquiryId: string;
  status: string;
  fields?: Record<string, unknown>;
};

export type PersonaInquiryStartResult = StartPersonaInquiryPayload;

export type CriminalCheckInput =
  StartInstantCriminalCheckMutationVariables['input'];
export type CriminalCheckResult =
  StartInstantCriminalCheckMutation['startInstantCriminalCheck'];

export type VerificationFlowResult = {
  inquiry: PersonaInquiryStartResult;
  launch: VerificationLaunchResult;
};

export type VerificationStatusDetails = {
  title: string;
  description: string;
  ctaLabel: string;
  canStart: boolean;
};

export type VerificationState = {
  identityVerificationStatus: IdentityVerificationStatus;
  personaInquiryId?: string | null;
  personaInquiryStatus?: PersonaInquiryStatus | null;
};

/**
 * Phases the consolidated verification flow renders against. The whole
 * post-paywall flow is one screen; this union is what swaps the body
 * section. Lives in `models/` so presentation-layer story previews can
 * reference it without crossing the hook-layer boundary.
 *
 * - `kickoff`: identity not yet started. CTA opens the Persona SDK.
 * - `waiting`: Persona done on the user's side; backend webhook pending.
 * - `timed-out`: ~30s waited without backend approval.
 * - `declined`: Persona returned a terminal failure. CTA retries.
 * - `criminal-intro`: identity Approved; show the criminal-check explainer.
 * - `criminal-form`: user tapped "Start search"; show the phone form.
 */
export type VerificationPhase =
  | 'kickoff'
  | 'waiting'
  | 'timed-out'
  | 'needs-review'
  | 'declined'
  | 'criminal-intro'
  | 'criminal-form';
