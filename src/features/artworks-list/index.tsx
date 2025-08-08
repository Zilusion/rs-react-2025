import type { Artwork } from '@/api/artworks-api.types';
import { Loader } from '../ui/loader';
import { Card } from '../ui/card';
import { Link, useParams } from 'react-router-dom';

interface ArtworksListProps {
  items: Artwork[];
  isLoading: boolean;
}

export function ArtworksList({ items, isLoading }: ArtworksListProps) {
  const params = useParams();
  const isDetailViewOpen = !!params.artworkId;

  if (isLoading) {
    return (
      <div className="sticky top-[50%] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (items.length === 0) {
    return <p>No results found for your query.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((artwork) => {
        return (
          <li key={artwork.id} className="flex">
            <Link
              to={{
                pathname: `./${artwork.id}`,
                search: location.search,
              }}
              replace={isDetailViewOpen}
              className="flex w-full"
            >
              <Card artwork={artwork} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
