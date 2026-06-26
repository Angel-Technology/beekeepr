import { searchRepository } from '../repository/searchRepository';
import type { SearchResultUser } from '../models/search.types';

export const searchService = {
  /**
   * Searches the user directory for matches against a nickname / handle.
   * Strips a leading `@` so users can paste or type a handle either way.
   * Empty or whitespace-only queries short-circuit to `[]` so we don't
   * waste a round-trip.
   */
  async searchUsers(query: string, first = 20): Promise<SearchResultUser[]> {
    const normalized = query.replace(/^@+/, '').trim();
    if (normalized.length === 0) {
      return [];
    }
    const payload = await searchRepository.searchUsers({
      query: normalized,
      first,
    });
    return payload.searchUsers?.nodes ?? [];
  },
};
