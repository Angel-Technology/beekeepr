import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IdentityVerificationStatus, useAuthSession } from '@features/auth';
import { useVerificationActions } from './useVerificationActions';
import type {
  VerificationState,
  VerificationStatusDetails,
} from '../models/verification.types';

const TRIAL_LENGTH_DAYS = 30;
const REMINDER_LEAD_DAYS = 5;

const addDays = (value: Date, days: number) => {
  const nextValue = new Date(value);
  nextValue.setDate(nextValue.getDate() + days);
  return nextValue;
};

const formatLongDate = (value: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
};

const getVerificationStatusDetails = ({
  identityVerificationStatus,
  personaInquiryId,
  personaInquiryStatus,
}: VerificationState): VerificationStatusDetails => {
  switch (identityVerificationStatus) {
    case IdentityVerificationStatus.Approved:
      return {
        title: 'Verification approved',
        description:
          'Your identity has been approved. You can return to the app and continue.',
        ctaLabel: 'Continue',
        canStart: true,
      };
    case IdentityVerificationStatus.Pending:
    case IdentityVerificationStatus.Created:
      return {
        title: 'Verification in progress',
        description: personaInquiryId
          ? `Inquiry ${personaInquiryId} is ${personaInquiryStatus?.toLowerCase() ?? 'in progress'}. You can reopen Persona to continue.`
          : 'Your Persona inquiry has been created. Continue the flow to finish verification.',
        ctaLabel: 'Continue',
        canStart: true,
      };
    case IdentityVerificationStatus.Completed:
    case IdentityVerificationStatus.NeedsReview:
      return {
        title: 'Verification submitted',
        description:
          'Your submission is complete and awaiting Persona review. Check back shortly for a final decision.',
        ctaLabel: 'Check Status',
        canStart: true,
      };
    case IdentityVerificationStatus.Declined:
    case IdentityVerificationStatus.Expired:
    case IdentityVerificationStatus.Failed:
      return {
        title: 'Verification needs attention',
        description:
          'The previous verification attempt did not complete successfully. Start a new attempt to continue.',
        ctaLabel: 'Try Again',
        canStart: true,
      };
    case IdentityVerificationStatus.NotStarted:
    default:
      return {
        title: 'Verification not started',
        description:
          'Start Persona to capture your driver’s license and selfie.',
        ctaLabel: 'Start Verification',
        canStart: true,
      };
  }
};

export const useVerifyIdentityScreen = () => {
  const router = useRouter();
  const { data: user } = useAuthSession();
  const { startVerification, refreshVerificationStatus } =
    useVerificationActions();
  const today = new Date();
  const trialEndDate = addDays(today, TRIAL_LENGTH_DAYS);

  const verificationStatus =
    user?.identityVerificationStatus ?? IdentityVerificationStatus.NotStarted;
  const verificationStatusDetails = getVerificationStatusDetails({
    identityVerificationStatus: verificationStatus,
    personaInquiryId: user?.personaInquiryId,
    personaInquiryStatus: user?.personaInquiryStatus,
  });

  const handleStartVerification = async () => {
    try {
      const result = await startVerification.mutateAsync();
      console.log('[verification] mutation resolved', result);

      Alert.alert(
        'Verification Submitted',
        `Inquiry ${result.launch.inquiryId} finished with status "${result.launch.status}".`,
      );
    } catch (error) {
      console.log('[verification] handleStartVerification caught', error);
      return;
    }
  };

  const handlePrimaryAction = async () => {
    if (verificationStatus === IdentityVerificationStatus.Approved) {
      router.replace('/');
      return;
    }

    if (
      verificationStatus === IdentityVerificationStatus.Completed ||
      verificationStatus === IdentityVerificationStatus.NeedsReview
    ) {
      await refreshVerificationStatus.mutateAsync();
      return;
    }

    await handleStartVerification();
  };

  return {
    verificationStatus,
    verificationStatusDetails,
    personaInquiryId: user?.personaInquiryId ?? null,
    personaInquiryStatus: user?.personaInquiryStatus ?? null,
    reminderLabel: `In ${TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days`,
    trialEndLabel: formatLongDate(trialEndDate),
    isPending:
      startVerification.isPending || refreshVerificationStatus.isPending,
    handlePrimaryAction,
    handleGoBack: () => router.back(),
  };
};
