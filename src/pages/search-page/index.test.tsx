import { render, screen } from '@testing-library/react';
import { SearchPage } from './index';
import { useLoaderData, useNavigation } from 'react-router-dom';

const MOCK_ARTWORKS_RESPONSE = {
  data: [
    {
      id: 1,
      title: 'Mona Lisa',
      artist_display: 'Leonardo da Vinci',
      date_display: 'c. 1503–1506',
      place_of_origin: 'Florence, Italy',
      image_id: 'some_image_id_1',
    },
    {
      id: 2,
      title: 'The Starry Night',
      artist_display: 'Vincent van Gogh',
      date_display: '1889',
      place_of_origin: 'Saint-Rémy-de-Provence, France',
      image_id: 'some_image_id_2',
    },
  ],
  info: {
    license_links: [],
    license_text: '',
    version: '',
  },
  pagination: {
    current_page: 1,
    limit: 16,
    offset: 0,
    total: 80,
    total_pages: 5,
  },
  config: {
    website_url: '',
    iiif_url: '',
  },
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigation: vi.fn(),
  };
});

vi.mock('@/features/artworks-search', () => ({
  ArtworksSearch: (props: { initialValue: string }) => (
    <div
      data-testid="artworks-search"
      data-initial-value={props.initialValue}
    />
  ),
}));

vi.mock('@/features/artworks-list', () => ({
  ArtworksList: (props: { items: unknown[]; isLoading: boolean }) => (
    <div
      data-testid="artworks-list"
      data-items-count={props.items.length}
      data-is-loading={props.isLoading}
    />
  ),
}));

vi.mock('@/features/ui/pagination', () => ({
  Pagination: (props: { currentPage: number; totalPages: number }) => (
    <div
      data-testid="pagination"
      data-current-page={props.currentPage}
      data-total-pages={props.totalPages}
    />
  ),
}));

describe('SearchPage (Unit)', () => {
  const mockedUseLoaderData = vi.mocked(useLoaderData);
  const mockedUseNavigation = vi.mocked(useNavigation);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should pass correct props when data is loaded and state is idle', () => {
    mockedUseLoaderData.mockReturnValue({
      artworksResponse: MOCK_ARTWORKS_RESPONSE,
      searchTerm: 'da vinci',
    });
    mockedUseNavigation.mockReturnValue({
      state: 'idle',
      location: undefined,
    } as ReturnType<typeof useNavigation>);

    render(<SearchPage />);

    const search = screen.getByTestId('artworks-search');
    expect(search).toHaveAttribute('data-initial-value', 'da vinci');

    const list = screen.getByTestId('artworks-list');
    expect(list).toHaveAttribute('data-items-count', '2');
    expect(list).toHaveAttribute('data-is-loading', 'false');

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-current-page', '1');
    expect(pagination).toHaveAttribute('data-total-pages', '5');
  });

  it('should pass isLoading=true when navigation state is "loading"', () => {
    mockedUseLoaderData.mockReturnValue({
      artworksResponse: MOCK_ARTWORKS_RESPONSE,
      searchTerm: 'da vinci',
    });
    mockedUseNavigation.mockReturnValue({
      state: 'loading',
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default',
      },
    } as ReturnType<typeof useNavigation>);

    render(<SearchPage />);

    const list = screen.getByTestId('artworks-list');
    expect(list).toHaveAttribute('data-is-loading', 'true');
  });
});
