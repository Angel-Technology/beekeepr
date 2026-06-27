import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MIN_QUERY_LENGTH } from '../models/searchConstants';
import { searchQueryKeys } from '../models/searchQueryKeys';
import { searchService } from '../services/searchService';

const DEBOUNCE_MS = 250;

const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

/**
 * Debounced user search. Empty / whitespace queries short-circuit to an
 * empty list with no network hop. `isLoading` is gated on `enabled` so
 * callers can render an empty pane (not a spinner) before anything is
 * typed.
 *
 * The "still debouncing" frame is folded into `isLoading` too, because
 * otherwise the moment the user types the third character we have:
 * `trimmedQuery.length >= MIN`, `debouncedQuery.length < MIN`, query
 * `enabled` false, `result.isFetching` false → `results = []` → callers
 * flash "No members found" for ~250ms before the fetch even kicks off.
 */
export const useSearchUsers = (query: string) => {
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, DEBOUNCE_MS);
  const meetsMinLength = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const enabled = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const isDebouncing = trimmedQuery !== debouncedQuery;
  const result = useQuery({
    queryKey: searchQueryKeys.users(debouncedQuery),
    queryFn: () => searchService.searchUsers(debouncedQuery),
    enabled,
  });
  return {
    results: result.data ?? [],
    isLoading:
      (meetsMinLength && isDebouncing) ||
      (enabled && result.isFetching && result.data === undefined),
    debouncedQuery,
  };
};
