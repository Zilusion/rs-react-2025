
import './globals.css';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default async function GlobalNotFound() {
  const t = await getTranslations('NotFoundPage');

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 text-center">
          <h1 className="text-8xl font-bold text-gray-800 drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-2xl font-medium text-gray-600">{t('subtitle')}</p>
          <p className="text-gray-500">{t('description')}</p>
          <Link
            href="/"
            className="mt-4 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            {t('goHome')}
          </Link>
        </div>
      </body>
    </html>
  );
}
