import { useEffect, useState } from 'react';
import { useAuthSession } from '@features/auth';
import { useErrorModal } from '@src/lib/error-modal';
import { useVerificationActions } from './useVerificationActions';

/**
 * Backend persists DOB as `YYYY-MM-DD`; the form displays `mm/dd/yyyy`.
 */
const formatDobForDisplay = (value?: string | null): string => {
  if (!value) {
    return '';
  }
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${month}/${day}/${year}`;
  }
  return value;
};

const PHONE_DIGIT_LIMIT = 10;

/**
 * Strips to digits, drops a leading `1` country code if present, caps at 10
 * digits, and reformats as `(XXX) XXX-XXXX`. Runs on every keystroke so the
 * input always shows a well-formed-looking number even when the user pastes
 * `+1 555-555-5555` or types raw digits.
 */
const formatPhoneForDisplay = (raw: string): string => {
  const allDigits = raw.replace(/\D/g, '');
  const trimmed =
    allDigits.length === 11 && allDigits.startsWith('1')
      ? allDigits.slice(1)
      : allDigits;
  const digits = trimmed.slice(0, PHONE_DIGIT_LIMIT);

  if (digits.length === 0) {
    return '';
  }
  if (digits.length <= 3) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const isValidPhoneNumber = (formatted: string): boolean =>
  formatted.replace(/\D/g, '').length === PHONE_DIGIT_LIMIT;

/**
 * Form state for the criminal-check phase of the verification flow.
 *
 * Read-only fields come straight from `user.verified*`; phone is the only
 * editable input (Persona doesn't capture it). On successful submit the
 * hook navigates home — that's the end of the flow.
 *
 * Gating, screening-exit, and privacy modals live on the parent screen.
 * This hook is concerned only with the form's data, validity, and submit
 * behaviour.
 *
 * Why phone is the only editable field: the rest come from Persona's
 * verified payload and shouldn't drift from the source of truth. Phone is
 * collected here because Persona doesn't capture it.
 */
export const useCriminalCheckForm = () => {
  const { data: user } = useAuthSession();
  const { startCriminalCheck } = useVerificationActions();
  const { showFromError } = useErrorModal();
  const [phoneNumber, setPhoneNumberRaw] = useState(
    formatPhoneForDisplay(user?.phoneNumber ?? ''),
  );
  // Lazy-touched: don't show the error state on first render — only after
  // the user has interacted (typed + blurred, or attempted submit). Avoids
  // greeting the user with a red error on a field they haven't touched.
  const [hasTouchedPhone, setHasTouchedPhone] = useState(false);

  useEffect(() => {
    // Seed once when the user record arrives — don't overwrite further edits.
    if (user?.phoneNumber && !phoneNumber) {
      setPhoneNumberRaw(formatPhoneForDisplay(user.phoneNumber));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phoneNumber]);

  const setPhoneNumber = (value: string) => {
    setPhoneNumberRaw(formatPhoneForDisplay(value));
  };

  const validatePhoneNumber = () => {
    setHasTouchedPhone(true);
  };

  const isPhoneValid = isValidPhoneNumber(phoneNumber);
  const phoneError =
    hasTouchedPhone && !isPhoneValid
      ? 'Enter a valid 10-digit phone number.'
      : undefined;

  const handleSubmit = async () => {
    if (!isPhoneValid) {
      setHasTouchedPhone(true);
      return;
    }

    try {
      // Backend stores digits-only; the formatting is just a display concern.
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      await startCriminalCheck.mutateAsync({
        phoneNumber: digitsOnly || undefined,
      });
      // No navigation here — the flow re-derives to the `congrats` phase
      // when the badge flips to Approved (or `denied` once that lands).
    } catch (error) {
      showFromError(error, 'Search Failed');
    }
  };

  return {
    firstName: user?.verifiedFirstName ?? '',
    middleName: user?.verifiedMiddleName ?? '',
    lastName: user?.verifiedLastName ?? '',
    dateOfBirth: formatDobForDisplay(user?.verifiedBirthdate),
    licenseState: user?.verifiedLicenseState ?? '',
    phoneNumber,
    setPhoneNumber,
    phoneError,
    validatePhoneNumber,
    isSubmitting: startCriminalCheck.isPending,
    canSubmit:
      Boolean(user?.verifiedFirstName) &&
      Boolean(user?.verifiedLastName) &&
      isPhoneValid,
    handleSubmit,
  };
};
