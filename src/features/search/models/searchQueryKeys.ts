export const searchQueryKeys = {
  all: ['search'] as const,
  usersRoot: () => [...searchQueryKeys.all, 'users'] as const,
  users: (query: string) => [...searchQueryKeys.usersRoot(), query] as const,
};
