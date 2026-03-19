import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './queryClient';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
