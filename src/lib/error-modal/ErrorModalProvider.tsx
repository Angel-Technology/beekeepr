import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ErrorModal } from './ErrorModal';

type ErrorModalContent = {
  title: string;
  message: string;
  primaryActionLabel?: string;
};

type ErrorModalContextValue = {
  showError: (content: ErrorModalContent) => void;
  hideError: () => void;
};

const ErrorModalContext = createContext<ErrorModalContextValue | null>(null);

const DEFAULT_TITLE = 'Something went wrong';
const DEFAULT_MESSAGE = 'Please try again.';

const messageFromError = (error: unknown): string => {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  if (typeof error === 'string' && error.length > 0) {
    return error;
  }
  return DEFAULT_MESSAGE;
};

/**
 * App-wide error modal. Any feature hook can call `useErrorModal().showError`
 * to surface a failure with a consistent visual treatment, replacing the
 * native `Alert.alert` which doesn't match the app's design system and
 * can't be styled.
 */
export const ErrorModalProvider = ({ children }: PropsWithChildren) => {
  const [content, setContent] = useState<ErrorModalContent | null>(null);
  // Hold onto the last-shown content so the dismiss animation keeps
  // displaying the previous title/message instead of flashing back to the
  // default copy ("Something went wrong" / "Please try again.") as the
  // modal slides away.
  const [lastShown, setLastShown] = useState<ErrorModalContent | null>(null);

  const showError = useCallback((next: ErrorModalContent) => {
    // Top-level log of every error modal opened. Lets us see in dev which
    // call sites are firing and with what copy when we're chasing
    // double-modal / unexpected-modal bugs. Safe to keep — it's a single
    // console line and only fires on actual errors.
    setContent(next);
    setLastShown(next);
  }, []);

  const hideError = useCallback(() => {
    setContent(null);
  }, []);

  const value = useMemo<ErrorModalContextValue>(
    () => ({ showError, hideError }),
    [showError, hideError],
  );

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
      <ErrorModal
        visible={content !== null}
        title={lastShown?.title ?? DEFAULT_TITLE}
        message={lastShown?.message ?? DEFAULT_MESSAGE}
        primaryActionLabel={lastShown?.primaryActionLabel}
        onClose={hideError}
      />
    </ErrorModalContext.Provider>
  );
};

export const useErrorModal = () => {
  const context = useContext(ErrorModalContext);
  if (!context) {
    throw new Error('useErrorModal must be used within ErrorModalProvider');
  }
  return {
    ...context,
    /**
     * Convenience: show an error using whatever message the thrown value
     * carries. Useful inside mutation `onError` handlers where the error
     * type is `unknown`.
     */
    showFromError: (error: unknown, title = DEFAULT_TITLE) => {
      // Log the raw error before we collapse it into a `{ title, message }`
      // payload — useful for inspecting `code` / `userCancelled` /
      // `userInfo` on RevenueCat (and other native-bridge) errors that
      // lose shape after `messageFromError`.
      context.showError({ title, message: messageFromError(error) });
    },
  };
};
