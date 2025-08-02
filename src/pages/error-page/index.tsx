import { ThemeSwitcher } from '@/features/ui/theme-switcher';
import { PATHS } from '@/lib/paths';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Something went wrong';
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100 transition-colors dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Oops!
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-gray-500 dark:text-gray-400">
        <i>{errorMessage}</i>
      </p>
      <Link
        to={PATHS.collection()}
        className="mt-4 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Go Home
      </Link>
    </div>
  );
}
