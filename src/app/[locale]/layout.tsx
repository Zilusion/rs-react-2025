import { type ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import './../globals.css';
import { Providers } from '../providers';
import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import RootLayoutUI from './layout-ui';

export const metadata: Metadata = {
  title: 'Artworks Search | AIC',
  description:
    'An application to search for artworks from the Art Institute of Chicago API.',
};

export default async function MainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          <RootLayoutUI>{children}</RootLayoutUI>
        </Providers>
      </body>
    </html>
  );
}
