import { useRouter } from 'expo-router';

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

  const today = new Date();
  const trialEndDate = addDays(today, TRIAL_LENGTH_DAYS);

  return {
    reminderLabel: `In ${TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days`,
    trialEndLabel: formatLongDate(trialEndDate),
    handleGetStarted: () => router.replace(NEXT_ROUTE),
    handleGoBack: () => router.back(),
  };
};
