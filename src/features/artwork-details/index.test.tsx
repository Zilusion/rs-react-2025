import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { getArtwork } from '@/api/artworks-api';
import { loader as artworkDetailsLoader } from './loader';
import { ArtworkDetails } from '.';
import type { Artwork } from '@/api/artworks-api.types';

vi.mock('@/api/artworks-api');

const mockArtwork = {
  data: {
    id: 1,
    title: 'Mona Lisa',
    artist_display: 'Leonardo da Vinci',
    date_display: 'c. 1503–1506',
    place_of_origin: 'Florence, Italy',
    image_id: 'some_image_id_1',
    short_description: 'A painting by Leonardo da Vinci',
    description: 'A painting by Leonardo da Vinci',
    dimensions: '41 x 30.5 cm',
    medium_display: 'Oil on canvas',
  },
};

const anotherMockArtwork = {
  data: {
    id: 2,
    title: 'The Starry Night',
    artist_display: 'Vincent van Gogh',
    date_display: '1889',
    place_of_origin: 'Saint-Rémy-de-Provence, France',
    image_id: 'some_image_id_2',
    short_description: 'A painting by Vincent van Gogh',
    description: 'A painting by Vincent van Gogh',
    dimensions: '41 x 30.5 cm',
    medium_display: 'Oil on canvas',
  },
};

const testRoutes = [
  {
    path: '/',
    element: <div>Search Page</div>,
  },
  {
    path: '/artworks/:artworkId',
    element: <ArtworkDetails />,
    loader: artworkDetailsLoader,
  },
];

describe('ArtworkDetails component', () => {
  const mockedGetArtwork = vi.mocked(getArtwork);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display artwork details correctly', async () => {
    mockedGetArtwork.mockResolvedValue(mockArtwork);
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/artworks/123'],
    });

    render(<RouterProvider router={router} />);

    expect(mockedGetArtwork).toHaveBeenCalledWith(123);
    expect(await screen.findByText(/Mona Lisa/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Leonardo da Vinci/i)).toHaveLength(2);
  });

  it('should navigate back to the search page with query params on close', async () => {
    const user = userEvent.setup();
    mockedGetArtwork.mockResolvedValue(mockArtwork);
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/artworks/123?q=forest&page=2'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);
    const closeButton = await screen.findByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(screen.getByText('Search Page')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toBe('?q=forest&page=2');
  });

  it('should display a loader during navigation between artwork details', async () => {
    mockedGetArtwork.mockResolvedValue(mockArtwork);

    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/artworks/123'],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/Mona Lisa/i)).toBeInTheDocument();

    let resolvePromise: (value: { data: Artwork }) => void;
    const longPromise = new Promise<{ data: Artwork }>((resolve) => {
      resolvePromise = resolve;
    });
    mockedGetArtwork.mockReturnValue(longPromise);

    act(() => {
      router.navigate('/artworks/456');
    });

    expect(await screen.findByRole('status')).toBeInTheDocument();
    act(() => {
      resolvePromise(anotherMockArtwork);
    });

    expect(await screen.findByText(/The Starry Night/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
