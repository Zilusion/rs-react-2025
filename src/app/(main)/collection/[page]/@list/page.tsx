// src/app/(main)/collection/[page]/page.tsx
import { getArtworks } from '@/api/artworks-api';
import { CollectionClient } from './client.tsx'; // Наш будущий клиентский компонент

interface CollectionPageProps {
  params: { page?: string };
  searchParams: { q?: string };
}

// Компонент теперь async и получает params и searchParams от Next.js
export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const currentPage = Number(params.page || '1');
  const searchTerm = searchParams.q || '';

  // try/catch здесь НЕ НУЖЕН.
  // Если getArtworks выбросит ошибку, Next.js автоматически поймает ее
  // и отрендерит ближайший `error.tsx` (наш `global-error.tsx`).
  const initialArtworksResponse = await getArtworks({
    page: currentPage,
    limit: 16,
    q: searchTerm,
  });

  // Передаем все необходимые данные в клиентский компонент
  return (
    <CollectionClient
      initialArtworksResponse={initialArtworksResponse}
      initialSearchTerm={searchTerm}
      initialPage={currentPage}
    />
  );
}
