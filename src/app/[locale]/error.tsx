'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { revalidateAndRetry } from '../actions';

interface LocaleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error }: LocaleErrorProps) {
  const t = useTranslations('GlobalError');
  const pathname = usePathname();

  const handleRetry = () => {
    revalidateAndRetry(pathname);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 transition-colors dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t('title')}
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        {error.message || t('description')}
      </p>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleRetry}
          className="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
}
