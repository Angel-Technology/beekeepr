import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { FieldStatus } from '../models/account.types';
import { accountQueryKeys } from '../models/accountQueryKeys';
import { accountService } from '../services/accountService';
import { stripHandlePrefix } from './profileFormReducer';

const DEBOUNCE_MS = 350;
const MIN_HANDLE_LENGTH = 3;
const MAX_HANDLE_LENGTH = 24;
const HANDLE_FORMAT = /^[a-z0-9_]+$/i;

type LocalValidationResult =
  | { kind: 'empty' }
  | { kind: 'tooShort' }
  | { kind: 'tooLong' }
  | { kind: 'invalidChars' }
  | { kind: 'ok'; normalized: string };

const validateHandleFormat = (rawHandle: string): LocalValidationResult => {
  const stripped = stripHandlePrefix(rawHandle);
  if (stripped.length === 0) {
    return { kind: 'empty' };
  }
  if (stripped.length < MIN_HANDLE_LENGTH) {
    return { kind: 'tooShort' };
  }
  if (stripped.length > MAX_HANDLE_LENGTH) {
    return { kind: 'tooLong' };
  }
  if (!HANDLE_FORMAT.test(stripped)) {
    return { kind: 'invalidChars' };
  }
  return { kind: 'ok', normalized: stripped.toLowerCase() };
};

const REASON_BY_KIND: Record<
  Exclude<LocalValidationResult['kind'], 'ok' | 'empty'>,
  string
> = {
  tooShort: `Handle must be at least ${MIN_HANDLE_LENGTH} characters.`,
  tooLong: `Handle can be at most ${MAX_HANDLE_LENGTH} characters.`,
  invalidChars: 'Handle can only contain letters, numbers, and underscores.',
};

/**
 * Live availability check for the handle field. Pipeline:
 *
 * 1. Local format validation runs synchronously on every keystroke — too
 *    short / invalid chars / etc. never hit the backend.
 * 2. Valid handles are debounced 350ms, then a `checkHandleAvailability`
 *    query fires. `keepPreviousData` would flicker the icon between
 *    keystrokes, so we explicitly let it switch back to 'saving' when
 *    the debounce restarts.
 * 3. Result feeds back as a `FieldStatus` for the right-accessory icon
 *    plus a `reason` string for inline error copy.
 *
 * The empty state returns 'idle' so the field shows no icon until the
 * user actually starts typing.
 */
export const useCheckHandleAvailability = (handle: string) => {
  const local = validateHandleFormat(handle);
  const targetHandle = local.kind === 'ok' ? local.normalized : '';

  const [debouncedHandle, setDebouncedHandle] = useState(targetHandle);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedHandle(targetHandle);
    }, DEBOUNCE_MS);
    return () => globalThis.clearTimeout(timer);
  }, [targetHandle]);

  const query = useQuery({
    queryKey: accountQueryKeys.handleAvailability(debouncedHandle),
    queryFn: () => accountService.checkHandleAvailability(debouncedHandle),
    enabled: debouncedHandle.length > 0,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Status derivation — local errors trump backend, since they're cheaper
  // signals and we never even sent the request.
  let status: FieldStatus = 'idle';
  let reason: string | null = null;

  if (local.kind === 'empty') {
    status = 'idle';
  } else if (local.kind !== 'ok') {
    status = 'error';
    reason = REASON_BY_KIND[local.kind];
  } else if (debouncedHandle !== local.normalized || query.isFetching) {
    // Either the debounce hasn't caught up yet, or a request is in flight.
    status = 'saving';
  } else if (query.error) {
    status = 'error';
    reason = 'Couldn’t check availability. Try again.';
  } else if (query.data) {
    if (query.data.available) {
      status = 'success';
    } else {
      status = 'error';
      reason = query.data.reason ?? 'That handle is already taken.';
    }
  }

  return { status, reason };
};
