import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useErrorModal } from '@src/lib/error-modal';
import { useRevenueCat } from '@src/lib/revenuecat';

const HOME_ROUTE = '/';

/**
 * Shared payment hook for the trial CTAs that live on both the
 * `VerificationLearnMoreScreen` and the in-flow `CongratsSection`. Wraps
 * `useRevenueCat().purchase` with:
 *
 * - `isPurchasing` so the calling button can render its loading spinner
 *   and guard against double-tap.
 * - Global error modal on real failures (user-cancel stays silent).
 * - Navigation to `/` on success so the home tab re-derives to the
 *   subscribed welcome flow without the caller having to know.
 */
export const useTrialPurchase = () => {
  const router = useRouter();
  const { purchase } = useRevenueCat();
  const { showFromError } = useErrorModal();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const startTrial = async () => {
    if (isPurchasing) {
      return;
    }
    setIsPurchasing(true);
    try {
      const succeeded = await purchase();
      if (succeeded) {
        router.replace(HOME_ROUTE);
      }
      // `false` is the user-cancelled path — stay silent.
    } catch (error) {
      showFromError(error, 'Purchase Failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  return { isPurchasing, startTrial };
};
