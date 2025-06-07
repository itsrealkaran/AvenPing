'use client';

import { ReactNode } from 'react';
import { UserProvider } from './user-context';
import { MessagesProvider } from './messages-context';
import { Providers as TanStackQueryProvider } from '@/lib/providers';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackQueryProvider>
      <UserProvider>
        <MessagesProvider>
          {children}
        </MessagesProvider>
      </UserProvider>
    </TanStackQueryProvider>
  );
} 