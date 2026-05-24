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

  const showError = useCallback((next: ErrorModalContent) => {
    setContent(next);
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
        title={content?.title ?? DEFAULT_TITLE}
        message={content?.message ?? DEFAULT_MESSAGE}
        primaryActionLabel={content?.primaryActionLabel}
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
    showFromError: (error: unknown, title = DEFAULT_TITLE) =>
      context.showError({ title, message: messageFromError(error) }),
  };
};
