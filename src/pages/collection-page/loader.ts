import type { LoaderFunctionArgs } from 'react-router-dom';
import { getArtworks } from '@/api/artworks-api';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') || '';
  const page = params.page || '1';

  const artworksResponse: ArtworksApiResponse = await getArtworks({
    page: Number(page),
    limit: 16,
    q: searchTerm,
  });

  return { artworksResponse, searchTerm, currentPage: Number(page) };
}
