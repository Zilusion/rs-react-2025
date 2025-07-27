import type { Artwork } from '@/api/artworks-api.types';
import { Loader } from '../ui/loader';
import { Card } from '../ui/card';
import { Link } from 'react-router-dom';

interface ArtworksListProps {
  items: Artwork[];
  isLoading: boolean;
  buildDetailUrl: (artworkId: number) => string;
}

export function ArtworksList({
  items,
  isLoading,
  buildDetailUrl,
}: ArtworksListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return <p>No results found for your query.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((artwork) => {
        const detailUrl = buildDetailUrl(artwork.id);
        return (
          <li key={artwork.id} className="flex">
            <Link to={detailUrl} className="flex w-full">
              <Card artwork={artwork} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
