import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { BuzzFlow } from '../models/buzzFlow.types';

export const useBuzzScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ backgroundCheck?: string }>();
  const hasSubmittedBackgroundCheck = params.backgroundCheck === 'submitted';

  const flow = useMemo<BuzzFlow>(() => {
    return hasSubmittedBackgroundCheck ? 'active' : 'verify';
  }, [hasSubmittedBackgroundCheck]);

  return {
    flow,
    resetSubmittedBackgroundCheck: () => {
      router.replace('/');
    },
  };
};
