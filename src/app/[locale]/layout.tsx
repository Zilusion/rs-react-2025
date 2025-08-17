import { type ReactNode } from 'react';
import { ThemeSwitcher } from '@/features/ui/theme-switcher';
import { Flyout } from '@/features/flyout';
import { PATHS } from '@/lib/paths';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import './../globals.css';
import { Providers } from '../providers';
import { Metadata } from 'next';
import { LanguageSwitcher } from '@/features/ui/language-switcher';
import { getMessages, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

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
  const t = await getTranslations('Layout');
  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-gray-50 transition-colors dark:bg-gray-900">
            <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-700 dark:bg-gray-800/80">
              <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <Link
                  href={PATHS.collection()}
                  className="text-2xl font-bold text-gray-900 transition-colors dark:text-gray-100"
                >
                  {t('artGallery')}
                </Link>
                <nav className="flex items-center gap-6 text-lg">
                  <Link
                    href={PATHS.collection()}
                    className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    {t('search')}
                  </Link>
                  <Link
                    href={PATHS.about}
                    className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  >
                    {t('about')}
                  </Link>
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </nav>
              </div>
            </header>
            <main>{children}</main>
            <footer className="p-4 text-center text-sm text-gray-500 transition-colors dark:text-gray-400">
              {t('footer')} © 2025
            </footer>
            <Flyout />
          </div>
        </Providers>
      </body>
    </html>
  );
}
