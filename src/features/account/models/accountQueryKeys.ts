export const accountQueryKeys = {
  all: ['account'] as const,
  searchUsers: (query: string) =>
    [...accountQueryKeys.all, 'search-users', query] as const,
  handleAvailability: (handle: string) =>
    [...accountQueryKeys.all, 'handle-availability', handle] as const,
};
