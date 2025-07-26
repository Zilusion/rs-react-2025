import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import { useLoaderData, useNavigation } from 'react-router-dom';

export function SearchPage() {
  const { artworksResponse, searchTerm } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <h1 className="text-2xl font-bold text-gray-800">
            Search for artworks
          </h1>
          <div className="w-full sm:w-auto">
            <ArtworksSearch initialValue={searchTerm} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ArtworksList items={artworksResponse.data} isLoading={isLoading} />
      </main>
    </div>
  );
}
