import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import {
  Outlet,
  useOutlet,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Pagination } from '@/features/ui/pagination';
import { useArtworks } from '@/features/artworks-list/useArtworks';
import { useQueryClient } from '@tanstack/react-query';

export function CollectionPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = Number(params.page || '1');
  const searchTerm = searchParams.get('q') || '';

  const { data, isLoading, isFetching, isError, error } = useArtworks({
    page: currentPage,
    limit: 16,
    q: searchTerm,
  });

  const artworks = data?.data || [];
  const totalPages = data?.pagination?.total_pages ?? 0;
  const isRefetchingList = isFetching && !isLoading;
  const outlet = useOutlet();

  const queryClient = useQueryClient();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['artworks'] });
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 px-4 py-8 transition-colors dark:bg-gray-900">
      <header className="bg-white shadow-sm transition-colors dark:bg-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800 transition-colors dark:text-gray-100">
            Search for artworks
          </h1>
          <div className="w-full sm:w-auto">
            <ArtworksSearch initialValue={searchTerm} />
          </div>
        </div>
      </header>

      {isRefetchingList && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 z-50 h-1 w-full animate-pulse bg-blue-500"
        ></div>
      )}

      <div className="relative container mx-auto grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
        <main className={outlet ? 'md:col-span-2' : 'md:col-span-3'}>
          {isError ? (
            <div className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">
              {error instanceof Error ? error.message : 'Error loading data.'}
            </div>
          ) : (
            <>
              <ArtworksList items={artworks} isLoading={isLoading} />

              {!isLoading && totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}

              {!isLoading && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleRefresh}
                    disabled={isFetching}
                    className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {outlet && (
          <aside className="md:col-span-1">
            <Outlet />
          </aside>
        )}
      </div>
    </div>
  );
}
