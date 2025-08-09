import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { CollectionPage } from './index';
import { ArtworkDetails } from '@/features/artwork-details';
import { getArtworks, getArtwork } from '@/api/artworks-api';
import {
  MOCK_API_RESPONSE_LIST,
  MOCK_API_RESPONSE_DETAILS,
  MOCK_API_RESPONSE_LIST_ANOTHER,
} from '@/__mocks__/artworks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';

vi.mock('@/api/artworks-api');

describe('CollectionPage (Integration)', () => {
  const user = userEvent.setup();
  const mockedGetArtworks = vi.mocked(getArtworks);
  const mockedGetArtwork = vi.mocked(getArtwork);

  const setupRouter = (initialEntries: string[]) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const router = createMemoryRouter(
      [
        {
          path: '/collection/:page?',
          element: <CollectionPage />,
          children: [
            {
              path: ':artworkId',
              element: <ArtworkDetails />,
            },
          ],
        },
      ],
      { initialEntries },
    );

    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data based on URL and display search results', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    const searchTerm = MOCK_API_RESPONSE_LIST.data[0].artist_display;

    setupRouter([`/collection/1?q=${encodeURIComponent(searchTerm)}`]);

    expect(
      await screen.findByRole('heading', {
        name: MOCK_API_RESPONSE_LIST.data[0].title,
      }),
    ).toBeInTheDocument();
    expect(mockedGetArtworks).toHaveBeenCalledWith({
      page: 1,
      limit: 16,
      q: searchTerm,
    });
    expect(screen.getByRole('searchbox')).toHaveValue(searchTerm);
  });

  it('should perform a new search and navigate to page 1', async () => {
    mockedGetArtworks.mockResolvedValueOnce(MOCK_API_RESPONSE_LIST);
    setupRouter([
      `/collection/5?q=${MOCK_API_RESPONSE_LIST.data[0].artist_display}`,
    ]);
    await screen.findByRole('heading', {
      name: MOCK_API_RESPONSE_LIST.data[0].title,
    });

    mockedGetArtworks.mockResolvedValueOnce(MOCK_API_RESPONSE_LIST_ANOTHER);

    const searchInput = screen.getByRole('searchbox');
    await user.clear(searchInput);
    await user.type(
      searchInput,
      MOCK_API_RESPONSE_LIST_ANOTHER.data[0].artist_display,
    );
    await user.click(screen.getByRole('button', { name: /Search/i }));

    await screen.findByText(MOCK_API_RESPONSE_LIST_ANOTHER.data[0].title);
    expect(mockedGetArtworks).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        q: MOCK_API_RESPONSE_LIST_ANOTHER.data[0].artist_display,
      }),
    );
  });

  it('should render a two-column layout when a detail view is active', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);

    setupRouter(['/collection/1/123']);

    await screen.findByRole('heading', {
      name: MOCK_API_RESPONSE_DETAILS.data.title,
    });

    expect(screen.getByRole('main')).toHaveClass('md:col-span-2');
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should refetch the list when refresh button is clicked', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    setupRouter(['/collection/1']);

    const refreshButton = await screen.findByRole('button', {
      name: /refresh/i,
    });
    expect(mockedGetArtworks).toHaveBeenCalledTimes(1);

    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockedGetArtworks).toHaveBeenCalledTimes(2);
    });
  });

  it('should display the refetching indicator when refetching', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    setupRouter(['/collection/1']);
    const refreshButton = await screen.findByRole('button', {
      name: /refresh/i,
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    let resolvePromise: (value: ArtworksApiResponse) => void;
    mockedGetArtworks.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await user.click(refreshButton);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refreshing/i })).toBeDisabled();

    act(() => {
      resolvePromise(MOCK_API_RESPONSE_LIST_ANOTHER);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('refetch-indicator')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /refresh/i })).not.toBeDisabled();
  });
});
