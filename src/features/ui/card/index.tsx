import { getArtworkImageUrl } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { ImageWithFallback } from '../image-with-fallback';

interface CardProps {
  artwork: Artwork;
}

export function Card({ artwork }: CardProps) {
  const imageUrl = getArtworkImageUrl(artwork.image_id);

  return (
    <article className="flex grow flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl dark:bg-gray-900 dark:shadow-black/40">
      <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 dark:bg-gray-800">
        <ImageWithFallback
          src={imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {artwork.title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-600 dark:text-gray-300">
          {artwork.artist_display}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {artwork.date_display} &middot; {artwork.place_of_origin}
        </p>
      </div>
    </article>
  );
}
