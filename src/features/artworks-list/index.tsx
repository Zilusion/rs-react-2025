import type { Artwork } from '@/api/artworks-api.types';
import { Loader } from '../ui/loader';
import { Card } from '../ui/card';

interface ArtworksListProps {
  items: Artwork[];
  isLoading: boolean;
}

export function ArtworksList({ items, isLoading }: ArtworksListProps) {
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
      {items.map((artwork) => (
        <li key={artwork.id} className="flex">
          <Card artwork={artwork} />
        </li>
      ))}
    </ul>
  );
}
