import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useRevenueCat } from '@src/lib/revenuecat';

const TRIAL_LENGTH_DAYS = 7;
const REMINDER_LEAD_DAYS = 1;

type PaymentError = {
  title: string;
  message: string;
};

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

const ENTITLED_NEXT_ROUTE = '/verify-identity/identity';

/**
 * Drives the paywall (entry to the verification flow). Owns the
 * subscription-purchase concerns that the rest of the flow doesn't need:
 * trial dates, the subscription price, RevenueCat purchase, and the local
 * error/loading flags those produce.
 *
 * Self-redirect: when RevenueCat resolves and the user is already `isPro`,
 * we skip the paywall and advance to the kickoff screen. This is the only
 * verification screen with a self-redirect rather than a `useVerificationGate`
 * call — the paywall is the entry point, not a gated downstream screen.
 *
 * RevenueCat is intentionally kept here (not inside `useVerificationActions`)
 * because purchase belongs to the subscription system, not the verification
 * system.
 */
export const useVerificationPaywall = () => {
  const router = useRouter();
  const { isPro, isReady, subscriptionPriceString, purchase } = useRevenueCat();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);

  const today = new Date();
  const trialEndDate = addDays(today, TRIAL_LENGTH_DAYS);

  const advanceToVerification = () => {
    router.replace(ENTITLED_NEXT_ROUTE);
  };

  useEffect(() => {
    if (isReady && isPro) {
      advanceToVerification();
    }
    // advanceToVerification is stable router.replace
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isPro]);

  const handlePayFee = async () => {
    if (isPro) {
      advanceToVerification();
      return;
    }

    if (!subscriptionPriceString) {
      setPaymentError({
        title: 'Subscription unavailable',
        message: 'We could not load the subscription. Try again in a moment.',
      });
      return;
    }

    setIsPurchasing(true);

    try {
      const succeeded = await purchase();
      if (succeeded) {
        advanceToVerification();
      }
      // `false` is the user-cancelled path; stay silent.
    } catch (error) {
      setPaymentError({
        title: 'Payment failed',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePromoCode = () => {
    // TODO: wire promo-code redemption when the offer set is finalised.
    console.warn('promo-code redemption tapped — not yet wired');
  };

  return {
    isReady,
    isPro,
    monthlyPriceString: subscriptionPriceString,
    reminderLabel: `In ${TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days`,
    trialEndLabel: formatLongDate(trialEndDate),
    isPurchasing,
    isRedeemingPromo: false,
    paymentError,
    handlePayFee,
    handlePromoCode,
    handleDismissPaymentError: () => setPaymentError(null),
    handleGoBack: () => router.back(),
  };
};
