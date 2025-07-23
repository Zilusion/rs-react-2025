import { useEffect, useState } from 'react';
import { getArtworks } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { getStoredSearchTerm, setStoredSearchTerm } from '@/services/storage';
import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';

export function SearchPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(
    () => getStoredSearchTerm() || '',
  );
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);

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

  if (shouldThrowError) {
    throw new Error('I crashed on purpose!');
  }

  const handleSearch = (newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
    setStoredSearchTerm(newSearchTerm);
  };

  const handleThrowError = () => {
    setShouldThrowError(true);
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
      <footer className="p-4 text-center">
        <button
          onClick={handleThrowError}
          className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Throw Error
        </button>
      </footer>
    </div>
  );
}
