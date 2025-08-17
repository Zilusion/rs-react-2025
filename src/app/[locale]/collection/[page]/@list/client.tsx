'use client';

import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import { Pagination } from '@/features/ui/pagination';
import { useRouter } from 'next/navigation';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';
import { useTranslations } from 'next-intl';

interface ListClientProps {
  initialArtworksResponse: ArtworksApiResponse;
}

export function ListClient({ initialArtworksResponse }: ListClientProps) {
  const router = useRouter();

  const artworks = initialArtworksResponse.data || [];
  const totalPages = initialArtworksResponse.pagination?.total_pages ?? 0;

  const handleRefresh = () => {
    router.refresh();
  };

  const t = useTranslations('CollectionPage');

  return (
    <>
      <header className="bg-white shadow-sm transition-colors dark:bg-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800 transition-colors dark:text-gray-100">
            {t('title')}
          </h1>
          <div className="w-full sm:w-auto">
            <ArtworksSearch />
          </div>
        </div>
      </header>

      <div className="py-8">
        <ArtworksList items={artworks} />

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination totalPages={totalPages} />
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleRefresh}
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {t('refresh')}
          </button>
        </div>
      </div>
    </>
  );
}
