export const homeQueryKeys = {
  all: ['home'] as const,
  connections: () => [...homeQueryKeys.all, 'connections'] as const,
  incomingInvites: () => [...homeQueryKeys.all, 'incoming-invites'] as const,
  outgoingInvites: () => [...homeQueryKeys.all, 'outgoing-invites'] as const,
  blockedUsers: () => [...homeQueryKeys.all, 'blocked-users'] as const,
};
