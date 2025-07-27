import { PATHS } from '@/lib/paths';
import { Link, useLocation } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const location = useLocation();

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const hasPreviousPage = previousPage > 0;
  const hasNextPage = nextPage <= totalPages;

  const buildUrl = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    return `${PATHS.collection(page)}?${searchParams.toString()}`;
  };

  const linkClasses =
    'rounded border bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-200 duration-300 ease-in-out';

  return (
    <nav className="flex items-center justify-center gap-4">
      {hasPreviousPage ? (
        <Link to={buildUrl(previousPage)} className={linkClasses}>
          ← Previous
        </Link>
      ) : null}

      <span className="font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      {hasNextPage ? (
        <Link to={buildUrl(nextPage)} className={linkClasses}>
          Next →
        </Link>
      ) : null}
    </nav>
  );
}
