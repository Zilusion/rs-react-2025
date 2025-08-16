import { ThemeSwitcher } from '@/features/ui/theme-switcher';
import { PATHS } from '@/lib/paths';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 text-center transition-colors dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <h1 className="text-8xl font-bold text-gray-800 drop-shadow-lg dark:text-gray-100">
        404
      </h1>
      <p className="text-2xl font-medium text-gray-600 dark:text-gray-300">
        Page Not Found
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href={PATHS.collection()}
        className="mt-4 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Go Home
      </Link>
    </div>
  );
}
