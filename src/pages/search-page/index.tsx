import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import { useLoaderData, useNavigation } from 'react-router-dom';

export function SearchPage() {
  const { artworksResponse, searchTerm } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800">
            Search for artworks
          </h1>
          <nav className="w-full sm:w-auto">
            <ArtworksSearch initialValue={searchTerm} />
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ArtworksList items={artworksResponse.data} isLoading={isLoading} />
      </main>
    </div>
  );
}
