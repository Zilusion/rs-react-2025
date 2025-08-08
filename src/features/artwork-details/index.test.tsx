import { render, screen, act, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArtworkDetails } from '.';
import { getArtwork } from '@/api/artworks-api';
import {
  MOCK_API_RESPONSE_DETAILS,
  MOCK_API_RESPONSE_DETAILS_ANOTHER,
} from '@/__mocks__/artworks';
import type {
  Artwork,
  ArtworkDetailApiResponse,
} from '@/api/artworks-api.types';

vi.mock('@/api/artworks-api');

describe('ArtworkDetails component', () => {
  const mockedGetArtwork = vi.mocked(getArtwork);
  const user = userEvent.setup();

  const setupRouter = (initialEntries: string[], initialIndex?: number) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const router = createMemoryRouter(
      [
        {
          path: '/collection/:page',
          element: <div>Collection Page Content</div>,
        },
        {
          path: '/collection/:page/:artworkId',
          element: <ArtworkDetails />,
        },
      ],
      {
        initialEntries,
        initialIndex,
      },
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

  it('should fetch and display artwork details correctly', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    setupRouter(['/collection/1/123']);

    expect(
      await screen.findByRole('heading', {
        name: MOCK_API_RESPONSE_DETAILS.data.title,
      }),
    ).toBeInTheDocument();
    expect(mockedGetArtwork).toHaveBeenCalledWith(123);
  });

  it('should display a loader on initial load', async () => {
    let resolvePromise: (value: ArtworkDetailApiResponse) => void;
    mockedGetArtwork.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    setupRouter(['/collection/1/123']);

    expect(await screen.findByRole('status')).toBeInTheDocument();

    act(() => {
      resolvePromise(MOCK_API_RESPONSE_DETAILS);
    });
  });

  it('should navigate to the previous page in history on close', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    setupRouter(['/collection/5?q=night', '/collection/5/123?q=night'], 1);

    const closeButton = await screen.findByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(
      await screen.findByText('Collection Page Content'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: MOCK_API_RESPONSE_DETAILS.data.title,
      }),
    ).not.toBeInTheDocument();
  });

  it('should display an error message if the API call fails', async () => {
    const apiError = new Error('Network Failure');
    mockedGetArtwork.mockRejectedValue(apiError);

    setupRouter(['/collection/1/123']);

    expect(await screen.findByText(/Network Failure/i)).toBeInTheDocument();
  });

  it('should display a "not found" message if the API returns no data', async () => {
    const mockNotFoundResponse = {
      ...MOCK_API_RESPONSE_DETAILS,
      data: null as unknown as Artwork,
    };
    mockedGetArtwork.mockResolvedValue(mockNotFoundResponse);
    setupRouter(['/collection/1/123']);

    expect(await screen.findByText('Artwork not found.')).toBeInTheDocument();
  });

  it('should refetch the data when the refresh button is clicked', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    setupRouter(['/collection/1/123']);

    const refreshButton = await screen.findByRole('button', {
      name: /refresh/i,
    });
    expect(mockedGetArtwork).toHaveBeenCalledTimes(1);

    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockedGetArtwork).toHaveBeenCalledTimes(2);
    });
  });

  it('should display a generic error message for non-Error exceptions', async () => {
    const apiErrorString = 'A server string error';
    mockedGetArtwork.mockRejectedValue(apiErrorString);

    setupRouter(['/collection/1/123']);

    expect(await screen.findByText('Failed to load data.')).toBeInTheDocument();
  });

  it('should display a fetching UI state during refetch', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    setupRouter(['/collection/1/123']);

    const refreshButton = await screen.findByRole('button', {
      name: /refresh/i,
    });
    const articleElement = screen.getByRole('article');

    expect(articleElement).not.toHaveClass('opacity-50');

    let resolvePromise: (value: ArtworkDetailApiResponse) => void;
    mockedGetArtwork.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    await user.click(refreshButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /refreshing/i }),
      ).toBeDisabled();
      expect(articleElement).toHaveClass('opacity-50');
    });

    act(() => {
      resolvePromise(MOCK_API_RESPONSE_DETAILS_ANOTHER);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /refresh/i }),
      ).not.toBeDisabled();
      expect(articleElement).not.toHaveClass('opacity-50');
    });
  });
});
