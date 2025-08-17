import { getArtwork } from '@/api/artworks-api';
import { DetailsClient } from './client';

interface ArtworkDetailsPageProps {
  params: Promise<{ artworkId?: string }>;
}

export default async function ArtworkDetailsPage({
  params: awaitedParams,
}: ArtworkDetailsPageProps) {
  const { artworkId } = await awaitedParams;
  if (!artworkId) {
    return null;
  }

  const artworkResponse = await getArtwork(Number(artworkId));
  return <DetailsClient artwork={artworkResponse.data} />;
}
