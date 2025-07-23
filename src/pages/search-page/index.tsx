import { useEffect, useState } from 'react';
import { getArtworks } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

export function SearchPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useLocalStorageState('searchTerm', '');

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getArtworks({
          page: 1,
          limit: 16,
          q: searchTerm,
        });
        setArtworks(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSearch = (newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800">
            Search for artworks
          </h1>
          <nav className="w-full sm:w-auto">
            <ArtworksSearch initialValue={searchTerm} onSearch={handleSearch} />
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ArtworksList items={artworks} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
}
