import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// `hasSeen` stays `null` until the AsyncStorage read resolves so callers can
// gate the UI on `isLoading` and avoid flashing the gated content for one
// frame on cold start.
export const useDismissibleOnce = (key: string) => {
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((value) => {
        if (cancelled) return;
        setHasSeen(value === 'true');
      })
      .catch(() => {
        if (cancelled) return;
        setHasSeen(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const markSeen = useCallback(() => {
    setHasSeen(true);
    void AsyncStorage.setItem(key, 'true');
  }, [key]);

  return { hasSeen, isLoading: hasSeen === null, markSeen };
};
