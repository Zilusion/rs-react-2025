import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-medium text-gray-600">Page Not Found</p>
      <p className="text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
