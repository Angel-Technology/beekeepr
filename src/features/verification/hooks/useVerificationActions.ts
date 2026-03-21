import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authQueryKeys, authService } from '@features/auth';
import { verificationService } from '../services/verificationService';

export const useVerificationActions = () => {
  const queryClient = useQueryClient();

  const startVerification = useMutation({
    mutationFn: async () => {
      console.log('[verification] starting backend inquiry');

      const inquiry = await authService.startPersonaInquiry();

      console.log('[verification] backend inquiry created', inquiry);

      if (!inquiry.inquiryId) {
        throw new Error('Backend returned no Persona inquiry ID.');
      }

      console.log('[verification] launching Persona SDK', {
        inquiryId: inquiry.inquiryId,
      });

      const launch = await verificationService.startVerification({
        inquiryId: inquiry.inquiryId,
      });

      console.log('[verification] Persona SDK completed', launch);

      return {
        inquiry,
        launch,
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session(),
      });
    },
    onError: (error) => {
      console.log('[verification] startVerification failed', error);
      Alert.alert('Verification Failed', error.message);
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
    startVerification,
    refreshVerificationStatus,
  };
};
