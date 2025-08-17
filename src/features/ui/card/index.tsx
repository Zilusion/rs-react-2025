import { getArtworkImageUrl } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { ImageWithFallback } from '../image-with-fallback';
import { useSelectedArtworksStore } from '@/store/selected-artworks';

interface CardProps {
  artwork: Artwork;
}

export function Card({ artwork }: CardProps) {
  const imageUrl = getArtworkImageUrl(artwork.image_id);

  const addArtwork = useSelectedArtworksStore((state) => state.addArtwork);
  const removeArtwork = useSelectedArtworksStore(
    (state) => state.removeArtwork,
  );
  const isSelected = useSelectedArtworksStore((state) =>
    state.isSelected(artwork.id),
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isSelected) {
      removeArtwork(artwork.id);
    } else {
      addArtwork(artwork);
    }
  };

  return (
    <article className="relative flex grow flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl dark:bg-gray-900 dark:shadow-black/40">
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${artwork.title}`}
          name={`select-artwork-${artwork.id}`}
          id={`select-artwork-${artwork.id}`}
        />
      </div>

      <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 dark:bg-gray-800">
        <ImageWithFallback
          src={imageUrl}
          alt={artwork.title}
          width={400}
          height={300}
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
