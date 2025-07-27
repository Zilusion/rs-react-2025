import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import {
  Outlet,
  useLoaderData,
  useNavigation,
  useOutlet,
} from 'react-router-dom';
import { Pagination } from '@/features/ui/pagination';

export function SearchPage() {
  const { artworksResponse, searchTerm } = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const outlet = useOutlet();

  const { current_page, total_pages } = artworksResponse.pagination;

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

      <div
        className={`container mx-auto grid grid-cols-1 gap-8 px-4 py-8 ${
          outlet ? 'md:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        <main className="md:col-span-2">
          <ArtworksList
            items={artworksResponse.data}
            isLoading={
              isLoading && !navigation.location.pathname.includes('/artworks/')
            }
          />

          {!isLoading && total_pages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={current_page} totalPages={total_pages} />
            </div>
          )}
        </main>

        <aside className="md:col-span-1">
          <Outlet />
        </aside>
      </div>
    </div>
  );
}
