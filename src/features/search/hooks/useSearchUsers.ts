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
 */
export const useSearchUsers = (query: string) => {
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  const enabled = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const result = useQuery({
    queryKey: searchQueryKeys.users(debouncedQuery),
    queryFn: () => searchService.searchUsers(debouncedQuery),
    enabled,
  });
  return {
    results: result.data ?? [],
    isLoading: enabled && result.isFetching && result.data === undefined,
    debouncedQuery,
  };
};
