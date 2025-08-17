'use client';

import type { Artwork } from '@/api/artworks-api.types';
import { Card } from '../ui/card';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

interface ArtworksListProps {
  items: Artwork[];
}

export function ArtworksList({ items }: ArtworksListProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const isDetailViewOpen = !!params?.artworkId;

  if (items.length === 0) {
    return <p>No results found for your query.</p>;
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
