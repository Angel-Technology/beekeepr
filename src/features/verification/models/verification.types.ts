import type {
  IdentityVerificationStatus,
  PersonaInquiryStartResult,
  PersonaInquiryStatus,
} from '@features/auth';

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
