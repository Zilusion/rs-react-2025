import { getArtwork } from '@/api/artworks-api';
import type { LoaderFunctionArgs } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.artworkId) {
    throw new Response('Bad Request', {
      status: 400,
      statusText: 'Artwork ID is missing',
    });
  }

  const id = Number(params.artworkId);
  const response = await getArtwork(id);
  const artwork = response.data;
  return artwork;
}
