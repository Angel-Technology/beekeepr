import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '@features/auth';
import { verificationService } from '../services/verificationService';
import type { CriminalCheckInput } from '../models/verification.types';

/**
 * Single home for every TanStack mutation in the verification flow:
 * - `startPersonaVerification`: mint a Persona inquiry on the backend, then
 *   launch the Persona SDK against it. The SDK promise resolves when the
 *   user completes the in-flow capture; the backend status flip happens
 *   asynchronously via Persona's webhook (kickoff polls for it).
 * - `startCriminalCheck`: submit the find-records form once Persona has
 *   approved.
 * - `refreshVerificationStatus`: invalidate the session query so the next
 *   poll/hook read picks up backend changes (used after the Persona SDK
 *   closes, before the polling loop converges).
 *
 * Why one hook: these are the three discrete user-driven writes the flow
 * needs. Splitting them across multiple hooks (as we used to) made each
 * screen import a different shape of action, and made it harder to see
 * the full set of writes at a glance.
 */
export const useVerificationActions = () => {
  const queryClient = useQueryClient();

  const startPersonaVerification = useMutation({
    mutationFn: async () => {
      const inquiry = await verificationService.startPersonaInquiry();

      if (!inquiry.inquiryId) {
        throw new Error('Backend returned no Persona inquiry ID.');
      }

      // Backend omits the session token when the user has already finished
      // the SDK flow (Approved / Completed / NeedsReview). There's nothing
      // to launch in that case — let the mutation resolve so `onSuccess`
      // refreshes the session and the UI routes to the matching phase
      // (e.g., criminal-intro after Approved).
      if (!inquiry.sessionToken) {
        return { inquiry, launch: null };
      }

      const launch = await verificationService.startVerification({
        inquiryId: inquiry.inquiryId,
        sessionToken: inquiry.sessionToken,
      });

      return { inquiry, launch };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session(),
      });
    },
    onError: (error: Error) => {
      Alert.alert('Verification Failed', error.message);
    },
  });

  const startCriminalCheck = useMutation({
    mutationFn: (input: CriminalCheckInput) =>
      verificationService.startCriminalCheck(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session(),
      });
    },
  });

  const refreshVerificationStatus = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session(),
      });
    },
  });

  return {
    startPersonaVerification,
    startCriminalCheck,
    refreshVerificationStatus,
  };
};
