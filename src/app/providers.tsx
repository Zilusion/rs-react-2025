'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

export function Providers({
  children,
  locale,
  messages
}: {
    children: ReactNode;
    locale: string;
    messages: AbstractIntlMessages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
