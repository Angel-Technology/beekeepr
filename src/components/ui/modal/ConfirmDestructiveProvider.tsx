import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { ConfirmDestructiveModal } from './ConfirmDestructiveModal';

export type ConfirmDestructiveInput = {
  title: string;
  description: string;
  confirmLabel: string;
  /** Defaults to "Cancel" inside `ConfirmDestructiveModal`. */
  cancelLabel?: string;
};

type PendingConfirm = ConfirmDestructiveInput & {
  resolve: (confirmed: boolean) => void;
};

type ConfirmDestructiveContextValue = {
  confirm: (input: ConfirmDestructiveInput) => Promise<boolean>;
};

const ConfirmDestructiveContext =
  createContext<ConfirmDestructiveContextValue | null>(null);

/**
 * Hosts a single shared `ConfirmDestructiveModal` for the whole app.
 * Mount once near the root (after auth, above any consumer); consumers
 * call `useConfirmDestructive()` to get an async `confirm(...)` that
 * resolves `true` on confirm and `false` on cancel / dismiss.
 *
 * The promise-based API keeps call sites linear:
 *
 *     const confirm = useConfirmDestructive();
 *     const ok = await confirm({
 *       title: 'Remove from connections?',
 *       description: '...',
 *       confirmLabel: 'Remove',
 *     });
 *     if (!ok) return;
 *     removeFriend(user.id);
 *
 * One-modal-at-a-time. A second `confirm(...)` while one is open
 * implicitly cancels the first (resolves the earlier promise with
 * `false`) and replaces it — keeps the UI honest if a render burst
 * tries to surface two modals at once.
 */
export const ConfirmDestructiveProvider = ({ children }: PropsWithChildren) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((input: ConfirmDestructiveInput) => {
    return new Promise<boolean>((resolve) => {
      setPending((current) => {
        if (current) {
          // Race: an existing prompt was open. Resolve it as cancel so
          // its caller's `if (!ok) return;` short-circuits, then surface
          // the new one.
          current.resolve(false);
        }
        return { ...input, resolve };
      });
    });
  }, []);

  const handleConfirm = () => {
    pending?.resolve(true);
    setPending(null);
  };

  const handleCancel = () => {
    pending?.resolve(false);
    setPending(null);
  };

  return (
    <ConfirmDestructiveContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDestructiveModal
        visible={pending !== null}
        title={pending?.title ?? ''}
        description={pending?.description ?? ''}
        confirmLabel={pending?.confirmLabel ?? ''}
        cancelLabel={pending?.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmDestructiveContext.Provider>
  );
};

export const useConfirmDestructive = () => {
  const ctx = useContext(ConfirmDestructiveContext);
  if (!ctx) {
    throw new Error(
      'useConfirmDestructive must be used within ConfirmDestructiveProvider',
    );
  }
  return ctx.confirm;
};
