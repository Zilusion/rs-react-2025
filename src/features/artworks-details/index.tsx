import type { Artwork } from '@/api/artworks-api.types';
import { getArtworkImageUrl } from '@/api/artworks-api';
import { Loader } from '../ui/loader';
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

export function ArtworksDetails() {
  const artwork = useLoaderData() as Artwork;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [artwork.id]);

  const isLoading =
    navigation.state === 'loading' &&
    navigation.location.pathname.includes('/artworks/');

  const handleClose = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-96 w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = getArtworkImageUrl(artwork.image_id);
  const shouldShowPlaceholder = imageError || !imageUrl;

  return (
    <aside className="sticky top-28 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200">
      <button
        onClick={handleClose}
        className="self-end text-2xl font-bold text-gray-400 transition hover:text-gray-800"
        aria-label="Close details"
      >
        ×
      </button>

      <div className="aspect-square w-full">
        {shouldShowPlaceholder ? (
          <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 text-sm text-gray-400">
            No Image Available
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={artwork.title}
            className="h-full w-full rounded object-cover"
            onError={handleImageError}
          />
        )}
      </div>

      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900">{artwork.title}</h2>
        <p className="mt-1 text-lg text-gray-700">{artwork.artist_display}</p>
        <p className="mt-2 text-sm text-gray-500">
          {artwork.date_display} · {artwork.place_of_origin}
        </p>
      </div>

      {artwork.description && (
        <div
          className="prose prose-sm mt-4 line-clamp-5 max-w-none border-t border-gray-200 pt-4 text-gray-600"
          dangerouslySetInnerHTML={{ __html: artwork.description }}
        />
      )}

      <div className="mt-4 border-t border-gray-200 pt-4 text-sm">
        <h3 className="font-semibold text-gray-800">Details</h3>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="font-medium text-gray-500">Dimensions:</dt>
          <dd className="text-gray-700">{artwork.dimensions}</dd>
          <dt className="font-medium text-gray-500">Medium:</dt>
          <dd className="text-gray-700">{artwork.medium_display}</dd>
        </dl>
      </div>
    </aside>
  );
}
