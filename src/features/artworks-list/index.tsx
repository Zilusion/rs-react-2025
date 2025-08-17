'use client';

import type { Artwork } from '@/api/artworks-api.types';
import { Card } from '../ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface ArtworksListProps {
  items: Artwork[];
}

export function ArtworksList({ items }: ArtworksListProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const isDetailViewOpen = !!params?.artworkId;

  const t = useTranslations('CollectionPage');

  if (items.length === 0) {
    return <p>{t('noResults')}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((artwork) => {
        const page = params?.page || '1';

        return (
          <li key={artwork.id} className="flex">
            <Link
              href={{
                pathname: `/collection/${page}/${artwork.id}`,
                query: searchParams?.toString(),
              }}
              replace={isDetailViewOpen}
              className="flex w-full"
              scroll={false}
            >
              <Card artwork={artwork} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
