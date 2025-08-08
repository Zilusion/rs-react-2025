import { getArtwork } from '@/api/artworks-api';
import { useQuery } from '@tanstack/react-query';

export const useArtworkDetails = (artworkId: string | undefined) => {
  const id = artworkId ? Number(artworkId) : undefined;

  return useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (typeof id === 'undefined') {
        throw new Error('Artwork ID is required to fetch details.');
      }
      return getArtwork(id);
    },
    enabled: !!id,
  });
};
