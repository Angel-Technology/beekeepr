import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRevenueCat } from '@src/lib/revenuecat';
import { accountService } from '../services/accountService';

type UseRedeemPromoCodeOptions = {
  /**
   * Fired after a successful redemption and `refreshCustomerInfo()`. Caller
   * typically dismisses the modal. The screen state re-derives from the
   * refreshed `isPro` so no further work is required.
   */
  onRedeemed?: () => void;
};

const messageFromError = (error: unknown): string => {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return 'We couldn’t redeem that code. Please try again.';
};

/**
 * Single-submit state for the promo-code modal.
 *
 * Per the product call: no live validation. The server is the source of
 * truth for code shape, expiry, and redemption caps, so we only round-trip
 * on `redeem()`. Failures land in `error` for inline display via the
 * modal's `Input` `error` prop; the modal stays open so the user can retry
 * without re-typing.
 *
 * On success we explicitly refresh RevenueCat instead of waiting for its
 * customer-info listener — the backend grants the entitlement out-of-band,
 * and on iOS the listener fires inconsistently for non-purchase grants.
 */
export const useRedeemPromoCode = ({
  onRedeemed,
}: UseRedeemPromoCodeOptions = {}) => {
  const { ensureIdentified, refreshCustomerInfo } = useRevenueCat();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (next: string) => {
      // Backend grants the entitlement directly against RC's subscriber
      // record. If the SDK never identified the user (or is still on an
      // `$RCAnonymousID`), the grant 404s. Holding the gate here means
      // the server-side call always finds a subscriber to attach to.
      await ensureIdentified();
      await accountService.redeemPromoCode(next);
    },
    onSuccess: async () => {
      await refreshCustomerInfo();
      setCode('');
      setError(null);
      onRedeemed?.();
    },
    onError: (caught) => {
      setError(messageFromError(caught));
    },
  });

  const onChangeCode = (next: string) => {
    setCode(next);
    // Clear stale server-side errors as soon as the user edits — keeps the
    // inline "Invalid code" message from feeling sticky after a correction.
    if (error) {
      setError(null);
    }
  };

  const redeem = () => {
    if (mutation.isPending) {
      return;
    }
    const trimmed = code.trim();
    if (trimmed.length === 0) {
      setError('Enter a promo code to redeem.');
      return;
    }
    mutation.mutate(trimmed);
  };

  const reset = () => {
    setCode('');
    setError(null);
    mutation.reset();
  };

  return {
    code,
    setCode: onChangeCode,
    redeem,
    reset,
    isRedeeming: mutation.isPending,
    error,
    canRedeem: code.trim().length > 0 && !mutation.isPending,
  };
};
