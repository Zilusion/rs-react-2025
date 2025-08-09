import { getArtworks } from '@/api/artworks-api';
import type { ArtworksApiParams } from '@/api/artworks-api.types';
import { useQuery } from '@tanstack/react-query';

export const useArtworks = (params: ArtworksApiParams) => {
  return useQuery({
    queryKey: ['artworks', params],
    queryFn: () => getArtworks(params),
    staleTime: 1000 * 60 * 5,
  });
};
