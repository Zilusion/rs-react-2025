import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { CollectionPage } from './index';
import { loader as collectionLoader } from './loader';
import { ArtworkDetails } from '@/features/artwork-details';
import { loader as artworkDetailsLoader } from '@/features/artwork-details/loader';
import { getArtworks, getArtwork } from '@/api/artworks-api';
import {
  MOCK_API_RESPONSE_LIST,
  MOCK_API_RESPONSE_DETAILS,
  MOCK_API_RESPONSE_LIST_ANOTHER,
} from '@/__mocks__/artworks';

vi.mock('@/api/artworks-api');

describe('CollectionPage (Integration)', () => {
  const user = userEvent.setup();
  const mockedGetArtworks = vi.mocked(getArtworks);
  const mockedGetArtwork = vi.mocked(getArtwork);

  const setupRouter = (initialEntries: string[]) => {
    const router = createMemoryRouter(
      [
        {
          path: '/collection/:page?',
          element: <CollectionPage />,
          loader: collectionLoader,
          children: [
            {
              path: ':artworkId',
              element: <ArtworkDetails />,
              loader: artworkDetailsLoader,
            },
          ],
        },
      ],
      {
        initialEntries,
      },
    );
    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display search results from the initial URL search params', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    setupRouter([
      `/collection/1?q=${MOCK_API_RESPONSE_LIST.data[0].artist_display}`,
    ]);

    expect(
      await screen.findByRole('heading', {
        name: MOCK_API_RESPONSE_LIST.data[0].title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue(
      MOCK_API_RESPONSE_LIST.data[0].artist_display,
    );
    expect(mockedGetArtworks).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        q: MOCK_API_RESPONSE_LIST.data[0].artist_display,
      }),
    );
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

    expect(
      await screen.findByText(MOCK_API_RESPONSE_LIST_ANOTHER.data[0].title),
    ).toBeInTheDocument();

    expect(mockedGetArtworks).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        q: MOCK_API_RESPONSE_LIST_ANOTHER.data[0].artist_display,
      }),
    );
  });

  it('should render a full-width layout when no detail view is active', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    setupRouter(['/collection/1']);
    await screen.findByRole('heading', {
      name: MOCK_API_RESPONSE_LIST.data[0].title,
    });

    expect(screen.getByRole('main')).toHaveClass('md:col-span-3');
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('should render a two-column layout when a detail view is active', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);

    setupRouter(['/collection/1/123']);

    const heading = await screen.findAllByRole('heading', {
      name: MOCK_API_RESPONSE_DETAILS.data.title,
    });
    expect(heading[0]).toBeInTheDocument();

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('md:col-span-2');

    const asideElement = screen.getByRole('complementary');
    expect(asideElement).toBeInTheDocument();
  });
});
