import { render, screen } from '@testing-library/react';
import { CollectionPage } from './index';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MOCK_API_RESPONSE_LIST } from '@/__mocks__/artworks';
import { useArtworks } from '@/features/artworks-list/useArtworks';
import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';

vi.mock('@/features/artworks-list/useArtworks');

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

const createMockQueryResult = (
  status: UseQueryResult['status'],
  data?: ArtworksApiResponse,
  error?: Error,
): UseQueryResult<ArtworksApiResponse, Error> => {
  const baseResult = {
    isFetching: false,
    isSuccess: status === 'success',
    isError: status === 'error',
    isPending: status === 'pending',
    isLoading: status === 'pending',
    refetch: vi.fn(),
  };

  switch (status) {
    case 'success':
      return {
        ...baseResult,
        status,
        data: data,
        error: null,
      } as unknown as UseQueryResult<ArtworksApiResponse, Error>;
    case 'error':
      return {
        ...baseResult,
        status,
        data: undefined,
        error: error,
      } as unknown as UseQueryResult<ArtworksApiResponse, Error>;
    case 'pending':
    default:
      return {
        ...baseResult,
        status,
        data: undefined,
        error: null,
      } as unknown as UseQueryResult<ArtworksApiResponse, Error>;
  }
};

describe('CollectionPage (Unit)', () => {
  const mockedUseArtworks = vi.mocked(useArtworks);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = (initialEntries: string[]) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/collection/:page?" element={<CollectionPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should parse URL params and call useArtworks with correct values', () => {
    mockedUseArtworks.mockReturnValue(createMockQueryResult('success'));
    renderWithProviders(['/collection/5?q=cats']);
    expect(useArtworks).toHaveBeenCalledWith({ page: 5, limit: 16, q: 'cats' });
  });

  it('should pass correct props to children on success', () => {
    const mockData = {
      ...MOCK_API_RESPONSE_LIST,
      pagination: {
        ...MOCK_API_RESPONSE_LIST.pagination,
        total_pages: 5,
        current_page: 1,
      },
    };
    mockedUseArtworks.mockReturnValue(
      createMockQueryResult('success', mockData),
    );
    renderWithProviders(['/collection/1?q=da%20vinci']);
    expect(screen.getByTestId('pagination')).toHaveAttribute(
      'data-total-pages',
      '5',
    );
  });

  it('should pass isLoading=true when useArtworks is loading', () => {
    mockedUseArtworks.mockReturnValue(createMockQueryResult('pending'));
    renderWithProviders(['/collection/1']);
    expect(screen.getByTestId('artworks-list')).toHaveAttribute(
      'data-is-loading',
      'true',
    );
  });

  it('should render an error message when useArtworks returns an error', () => {
    mockedUseArtworks.mockReturnValue(
      createMockQueryResult('error', undefined, new Error('Network Error')),
    );
    renderWithProviders(['/collection/1']);
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });

  it('should default to page 1 when the page param is not in the URL', () => {
    mockedUseArtworks.mockReturnValue(createMockQueryResult('success'));

    renderWithProviders(['/collection?q=cats']);

    expect(mockedUseArtworks).toHaveBeenCalledWith({
      page: 1,
      limit: 16,
      q: 'cats',
    });
  });

  it('should display a generic error message for non-Error exceptions', () => {
    const errorState = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: 'Just a string error',
      isSuccess: false,
      isPending: false,
      status: 'error',
      refetch: vi.fn(),
    } as unknown as UseQueryResult<ArtworksApiResponse, Error>;

    mockedUseArtworks.mockReturnValue(errorState);

    renderWithProviders(['/collection/1']);

    expect(screen.getByText('Error loading data.')).toBeInTheDocument();
  });
});
