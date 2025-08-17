import { getArtworks } from '@/api/artworks-api';
import { ListClient } from './client';

interface ListPageProps {
  params: Promise<{ page?: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function ListPage({
  params: awaitedParams,
  searchParams: awaitedSearchParams,
}: ListPageProps) {
  const { page = '1' } = await awaitedParams;
  const { q: searchTerm = '' } = await awaitedSearchParams;

  const artworksResponse = await getArtworks({
    page: Number(page),
    limit: 16,
    q: searchTerm,
  });

  return <ListClient initialArtworksResponse={artworksResponse} />;
}

