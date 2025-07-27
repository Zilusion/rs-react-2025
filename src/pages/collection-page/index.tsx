import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';
import {
  Outlet,
  useLoaderData,
  useNavigation,
  useOutlet,
  useParams,
} from 'react-router-dom';
import { Pagination } from '@/features/ui/pagination';
import { PATHS } from '@/lib/paths';

export function CollectionPage() {
  const { artworksResponse, searchTerm } = useLoaderData();
  const navigation = useNavigation();
  const params = useParams();
  const isLoading = navigation.state === 'loading' && !params.artworkId;
  const outlet = useOutlet();

  const { current_page: currentPage, total_pages: totalPages } =
    artworksResponse.pagination;

  const buildDetailUrl = (artworkId: number) => {
    return `${PATHS.details(currentPage, artworkId)}${location.search}`;
  };

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
        className={`container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-3`}
      >
        <main className={outlet ? 'md:col-span-2' : 'md:col-span-3'}>
          <ArtworksList
            items={artworksResponse.data}
            isLoading={isLoading}
            buildDetailUrl={buildDetailUrl}
          />

          {!isLoading && totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          )}
        </main>

        {outlet && (
          <aside className="md:col-span-1">
            <Outlet />
          </aside>
        )}
      </div>
    </div>
  );
}
