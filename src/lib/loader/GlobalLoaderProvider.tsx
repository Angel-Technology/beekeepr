import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * App-wide "something is syncing in the background" signal.
 *
 * Why: features like inline-edit on the profile screen send updates to the
 * backend silently on blur. There's no per-screen save button to host a
 * spinner, so we hoist a single overlay loader that any feature hook can
 * raise. We ref-count by `key` so concurrent updates (e.g. nickname + handle
 * blurred in quick succession) only hide the loader once all in-flight calls
 * settle.
 *
 * Responsibilities:
 * - Track in-flight activity by string key with a ref counter.
 * - Expose `show(key)` / `hide(key)` for hooks, and the boolean `isActive`
 *   for the overlay.
 * - Provide a small `track(key, promise)` helper so callers can wrap a
 *   promise without manually pairing show/hide.
 */
type GlobalLoaderContextValue = {
  isActive: boolean;
  show: (key: string) => void;
  hide: (key: string) => void;
  track: <T>(key: string, promise: Promise<T>) => Promise<T>;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextValue | null>(
  null,
);

export const GlobalLoaderProvider = ({ children }: PropsWithChildren) => {
  const counts = useRef<Map<string, number>>(new Map());
  const [isActive, setIsActive] = useState(false);

  const recompute = useCallback(() => {
    let total = 0;
    counts.current.forEach((value) => {
      total += value;
    });
    setIsActive(total > 0);
  }, []);

  const show = useCallback(
    (key: string) => {
      const next = (counts.current.get(key) ?? 0) + 1;
      counts.current.set(key, next);
      recompute();
    },
    [recompute],
  );

  const hide = useCallback(
    (key: string) => {
      const current = counts.current.get(key) ?? 0;
      const next = Math.max(0, current - 1);
      if (next === 0) {
        counts.current.delete(key);
      } else {
        counts.current.set(key, next);
      }
      recompute();
    },
    [recompute],
  );

  const track = useCallback(
    async <T,>(key: string, promise: Promise<T>): Promise<T> => {
      show(key);
      try {
        return await promise;
      } finally {
        hide(key);
      }
    },
    [show, hide],
  );

  const value = useMemo<GlobalLoaderContextValue>(
    () => ({ isActive, show, hide, track }),
    [isActive, show, hide, track],
  );

  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within GlobalLoaderProvider');
  }
  return context;
};
