export const accountQueryKeys = {
  all: ['account'] as const,
  handleAvailability: (handle: string) =>
    [...accountQueryKeys.all, 'handle-availability', handle] as const,
};
