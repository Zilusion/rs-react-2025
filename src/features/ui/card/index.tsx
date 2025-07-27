import { getArtworkImageUrl } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface CardProps {
  artwork: Artwork;
}

export function Card({ artwork }: CardProps) {
  useEffect(() => {
    setImageError(false);
  }, [artwork.id]);

  const handleImageError = () => {
    setImageError(true);
  };

  const [imageError, setImageError] = useState(false);
  const imageUrl = getArtworkImageUrl(artwork.image_id);
  const shouldShowPlaceholder = imageError || !imageUrl;

  const location = useLocation();
  const detailUrl = `/artworks/${artwork.id}${location.search}`;

  return (
    <Link to={detailUrl} className="flex w-full">
      <article className="flex grow flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl">
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100">
          {shouldShowPlaceholder ? (
            <div className="text-sm text-gray-400">No Image Available</div>
          ) : (
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
            {artwork.title}
          </h3>
          <p className="line-clamp-1 text-sm text-gray-600">
            {artwork.artist_display}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {artwork.date_display} &middot; {artwork.place_of_origin}
          </p>
        </div>
      </article>
    </Link>
  );
}
