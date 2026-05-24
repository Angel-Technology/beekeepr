import { useRouter } from 'expo-router';
import { BackgroundCheckBadge, useAuthSession } from '@features/auth';
import { useTrialPurchase } from './useTrialPurchase';

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

const NEXT_ROUTE = '/verify-identity';

export const useVerificationLearnMore = () => {
  const router = useRouter();
  const { data: user } = useAuthSession();
  const { isPurchasing, startTrial } = useTrialPurchase();
  // Already-verified users land here from the home tab's "Start membership"
  // CTA — they don't need to re-run the verification kickoff, they need to
  // pick a payment path (trial or promo). The screen swaps its CTAs based
  // on this flag.
  const isVerified =
    user?.backgroundCheckBadge === BackgroundCheckBadge.Approved;

  const today = new Date();
  const trialEndDate = addDays(today, TRIAL_LENGTH_DAYS);

  return {
    isVerified,
    isPurchasing,
    reminderLabel: `In ${TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days`,
    trialEndLabel: formatLongDate(trialEndDate),
    handleGetStarted: () => router.replace(NEXT_ROUTE),
    handleStartTrial: startTrial,
    // TODO: wire promo-code redemption when the offer set is finalised.
    handleEnterPromoCode: () => {},
    handleGoBack: () => router.back(),
  };
};
