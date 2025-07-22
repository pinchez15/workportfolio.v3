'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  );
} 