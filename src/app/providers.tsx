'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
      <ThemeProvider>
        {children}
      </ThemeProvider>
  );
}
