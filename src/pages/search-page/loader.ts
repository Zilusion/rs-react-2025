import type { LoaderFunctionArgs } from 'react-router-dom';
import { getArtworks } from '@/api/artworks-api';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q') || '';
  const page = url.searchParams.get('page') || '1';

  const artworksResponse = await getArtworks({
    page: Number(page),
    limit: 16,
    q: searchTerm,
  });

  return { artworksResponse, searchTerm };
}
