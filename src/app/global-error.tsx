'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { PATHS } from '@/lib/paths';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 transition-colors dark:bg-gray-900">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <div className="mt-4 flex gap-4 items-center">
            <button
              onClick={() => reset()}
              className="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
            <Link
              href={PATHS.home}
              className="mt-4 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
