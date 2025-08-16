import { getArtworks } from '@/api/artworks-api';
import type { ArtworksApiParams, ArtworksApiResponse } from '@/api/artworks-api.types';
import { useQuery } from '@tanstack/react-query';

export const useArtworks = (params: ArtworksApiParams, initialData?: ArtworksApiResponse) => {
  return useQuery({
    queryKey: ['artworks', params],
    queryFn: () => getArtworks(params),
    staleTime: 1000 * 60 * 5,
    initialData: initialData,
  });
};
