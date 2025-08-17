'use client';

import type { Artwork } from '@/api/artworks-api.types';
import { getArtworkImageUrl } from '@/api/artworks-api';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from '@/features/ui/image-with-fallback';
import { useTranslations } from 'next-intl';

interface DetailsClientProps {
  artwork: Artwork;
}

export function DetailsClient({ artwork }: DetailsClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const imageUrl = getArtworkImageUrl(artwork.image_id);

  const t = useTranslations('Details');

  return (
    <article
      className={`sticky top-28 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-all duration-100 dark:bg-gray-900 dark:shadow-black/40 dark:ring-gray-700`}
    >
      <button
        onClick={handleClose}
        className="self-end text-2xl font-bold text-gray-400 transition hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200"
        aria-label={t('close')}
      >
        ×
      </button>

      <div className="aspect-square w-full">
        <ImageWithFallback
          src={imageUrl}
          alt={artwork.title}
          className="h-full w-full rounded object-cover"
        />
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {artwork.title}
        </h2>
        <p className="mt-1 text-lg text-gray-700 dark:text-gray-300">
          {artwork.artist_display}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {artwork.date_display} · {artwork.place_of_origin}
        </p>
      </div>

      {artwork.description && (
        <div
          className="prose prose-sm mt-4 line-clamp-5 max-w-none border-t border-gray-200 pt-4 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: artwork.description }}
        />
      )}

      <div className="mt-4 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {t('details')}
        </h3>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="font-medium text-gray-500 dark:text-gray-400">
            {t('dimensions')}:
          </dt>
          <dd className="text-gray-700 dark:text-gray-300">
            {artwork.dimensions}
          </dd>
          <dt className="font-medium text-gray-500 dark:text-gray-400">
            {t('medium')}:
          </dt>
          <dd className="text-gray-700 dark:text-gray-300">
            {artwork.medium_display}
          </dd>
        </dl>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleRefresh}
          className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {t('refresh')}
        </button>
      </div>
    </article>
  );
}
