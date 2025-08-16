'use client';

import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import { Pagination } from '@/features/ui/pagination';
import { useArtworks } from '@/features/artworks-list/useArtworks';
import { useQueryClient } from '@tanstack/react-query';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';

interface CollectionClientProps {
  initialArtworksResponse: ArtworksApiResponse;
  initialSearchTerm: string;
  initialPage: number;
}

export function CollectionClient({
  initialArtworksResponse,
  initialSearchTerm,
  initialPage,
}: CollectionClientProps) {
  const { data, isLoading, isFetching, isError, error } = useArtworks(
    {
      page: initialPage,
      limit: 16,
      q: initialSearchTerm,
    },
    initialArtworksResponse,
  );

  const queryClient = useQueryClient();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['artworks'] });
  };

  const artworks = data?.data || [];
  const totalPages = data?.pagination?.total_pages ?? 0;
  const isRefetchingList = isFetching && !isLoading;

  return (
    <>
      <header className="bg-white shadow-sm transition-colors dark:bg-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800 transition-colors dark:text-gray-100">
            Search for artworks
          </h1>
          <div className="w-full sm:w-auto">
            <ArtworksSearch />
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

      <div>
        {isError ? (
          <div className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">
            {error instanceof Error ? error.message : 'Error loading data.'}
          </div>
        ) : (
          <>
            <ArtworksList items={artworks} isLoading={isLoading} />
            {!isLoading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination totalPages={totalPages} />
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
      </div>
    </>
  );
}
