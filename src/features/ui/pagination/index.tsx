// src/features/ui/pagination/index.tsx
'use client';

// --- 1. Меняем импорты ---
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  // 2. Используем хуки Next.js
  const params = useParams();
  const searchParams = useSearchParams();

  // currentPage теперь всегда берется из URL
  const currentPage = Number(params?.page || '1');

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const hasPreviousPage = previousPage >= 1;
  const hasNextPage = nextPage <= totalPages;

  const buildUrl = (page: number) => {
    // 3. Строим URL на основе текущих search-параметров
    const newParams = new URLSearchParams(searchParams?.toString());
    // `page` теперь часть pathname, а не search, так что его не трогаем
    return `/collection/${page}?${newParams.toString()}`;
  };

  const linkClasses =
    'rounded border bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-200 duration-300 ease-in-out ' +
    'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700';

  return (
    <nav className="flex items-center justify-center gap-4 rounded py-4 dark:bg-gray-900">
      {hasPreviousPage && ( // Используем && для краткости
        <Link href={buildUrl(previousPage)} className={linkClasses}>
          ← Previous
        </Link>
      )}

      <span className="font-medium text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      {hasNextPage && (
        <Link href={buildUrl(nextPage)} className={linkClasses}>
          Next →
        </Link>
      )}
    </nav>
  );
}
