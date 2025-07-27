import { render, screen } from '@testing-library/react';
import { CollectionPage } from './index';
import { useLoaderData, useNavigation, useParams } from 'react-router-dom';
import { MOCK_API_RESPONSE_LIST } from '@/__mocks__/artworks';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigation: vi.fn(),
    useOutlet: vi.fn(() => null),
    useParams: vi.fn(),
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

describe('CollectionPage (Unit)', () => {
  const mockedUseLoaderData = vi.mocked(useLoaderData);
  const mockedUseNavigation = vi.mocked(useNavigation);
  const mockedUseParams = vi.mocked(useParams);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass correct props to children when data is loaded and state is idle', () => {
    mockedUseLoaderData.mockReturnValue({
      artworksResponse: {
        ...MOCK_API_RESPONSE_LIST,
        pagination: { ...MOCK_API_RESPONSE_LIST.pagination, total_pages: 5 },
      },
      searchTerm: 'da vinci',
      currentPage: 1,
    });
    mockedUseNavigation.mockReturnValue({
      state: 'idle',
      location: undefined,
    } as ReturnType<typeof useNavigation>);
    mockedUseParams.mockReturnValue({});

    render(<CollectionPage />);

    expect(screen.getByTestId('artworks-search')).toHaveAttribute(
      'data-initial-value',
      'da vinci',
    );
    const list = screen.getByTestId('artworks-list');
    expect(list).toHaveAttribute(
      'data-items-count',
      String(MOCK_API_RESPONSE_LIST.data.length),
    );
    expect(list).toHaveAttribute('data-is-loading', 'false');

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveAttribute('data-current-page', '1');
    expect(pagination).toHaveAttribute('data-total-pages', '5');
  });

  it('should pass isLoading=true to ArtworksList when navigation state is "loading"', () => {
    mockedUseLoaderData.mockReturnValue({
      artworksResponse: MOCK_API_RESPONSE_LIST,
      searchTerm: 'da vinci',
      currentPage: 1,
    });
    mockedUseNavigation.mockReturnValue({
      state: 'loading',
      location: {
        pathname: '/collection/1',
        search: '?q=cats',
        hash: '',
        state: null,
        key: 'abc',
      },
    } as ReturnType<typeof useNavigation>);
    mockedUseParams.mockReturnValue({});

    render(<CollectionPage />);

    const list = screen.getByTestId('artworks-list');
    expect(list).toHaveAttribute('data-is-loading', 'true');
  });

  it('should pass isLoading=false when loading details on the same page', () => {
    mockedUseLoaderData.mockReturnValue({
      artworksResponse: MOCK_API_RESPONSE_LIST,
      searchTerm: 'da vinci',
      currentPage: 1,
    });
    mockedUseNavigation.mockReturnValue({
      state: 'loading',
      location: {
        pathname: '/collection/1/123',
        search: '?q=cats',
        hash: '',
        state: null,
        key: 'abc',
      },
    } as ReturnType<typeof useNavigation>);
    mockedUseParams.mockReturnValue({ artworkId: '123' });

    render(<CollectionPage />);

    const list = screen.getByTestId('artworks-list');
    expect(list).toHaveAttribute('data-is-loading', 'false');
  });
});
