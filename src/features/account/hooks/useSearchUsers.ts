import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { accountQueryKeys } from '../models/accountQueryKeys';
import { accountService } from '../services/accountService';

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 1;

/**
 * Debounced user-directory search. Returns the latest query echoed back so
 * presentation can compare against the input value, plus the react-query
 * result for the most recent settled query.
 *
 * - Empty or single-character queries are not sent (avoids spamming the
 *   server before the user has typed anything meaningful).
 * - `keepPreviousData` so the dropdown doesn't flicker between keystrokes
 *   while a new request is in flight.
 */
export const useSearchUsers = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handle = globalThis.setTimeout(
      () => setDebouncedQuery(query),
      DEBOUNCE_MS,
    );
    return () => globalThis.clearTimeout(handle);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();
  const enabled = trimmedQuery.length >= MIN_QUERY_LENGTH;

  const result = useQuery({
    queryKey: accountQueryKeys.searchUsers(trimmedQuery),
    queryFn: () => accountService.searchUsers(trimmedQuery),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  return {
    debouncedQuery: trimmedQuery,
    results: result.data ?? [],
    isLoading: enabled && result.isLoading,
    isFetching: result.isFetching,
    error: result.error,
  };
};
