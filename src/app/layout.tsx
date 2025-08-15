import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import { Providers } from './providers.tsx';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artworks Search | AIC',
  description:
    'An application to search for artworks from the Art Institute of Chicago API.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
