const MOCK_ARTWORKS_RESPONSE_DA_VINCI = {
  data: [
    {
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
    {
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
  ],
  info: {
    license_links: [],
    license_text: '',
    version: '',
  },
  pagination: {
    current_page: 0,
    limit: 0,
    offset: 0,
    total: 0,
    total_pages: 0,
  },
  config: {
    website_url: '',
    iiif_url: '',
  },
};

const MOCK_ARTWORKS_RESPONSE_PICASSO = {
  data: [
    {
      id: 3,
      title: "Les Demoiselles d'Avignon",
      artist_display: 'Pablo Picasso',
      date_display: '1907',
      place_of_origin: 'Paris, France',
      image_id: 'some_image_id_3',
      short_description: 'A painting by Pablo Picasso',
      description: 'A painting by Pablo Picasso',
      dimensions: '41 x 30.5 cm',
      medium_display: 'Oil on canvas',
    },
  ],
  info: {
    license_links: [],
    license_text: '',
    version: '',
  },
  pagination: {
    current_page: 0,
    limit: 0,
    offset: 0,
    total: 0,
    total_pages: 0,
  },
  config: {
    website_url: '',
    iiif_url: '',
  },
};

const MOCK_ARTWORK_DETAILS = {
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

import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { loader } from './loader';
import { SearchPage } from './index';
import { getArtwork, getArtworks } from '@/api/artworks-api';
import userEvent from '@testing-library/user-event';
import { ArtworkDetails } from '@/features/artwork-details';
import { loader as artworkDetailsLoader } from '@/features/artwork-details/loader';

type ArtworksApiResponse = typeof MOCK_ARTWORKS_RESPONSE_DA_VINCI;

vi.mock('@/api/artworks-api', () => ({
  getArtworks: vi.fn(),
  getArtworkImageUrl: vi.fn(
    (imageId: string) =>
      `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`,
  ),
  getArtwork: vi.fn(),
}));

describe('SearchPage (Integration)', () => {
  const user = userEvent.setup();
  const mockedGetArtworks = vi.mocked(getArtworks);
  const mockedGetArtwork = vi.mocked(getArtwork);

  afterEach(() => {
    vi.clearAllMocks();
  });

  interface TestRouterProps {
    initialEntries?: string[];
  }

  const TestRouter = ({
    initialEntries = ['/?q=da%20vinci'],
  }: TestRouterProps) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <SearchPage />,
          loader: loader,
          children: [
            {
              path: 'artworks/:artworkId',
              element: <ArtworkDetails />,
              loader: artworkDetailsLoader,
            },
          ],
        },
      ],
      {
        initialEntries: initialEntries,
      },
    );
    return <RouterProvider router={router} />;
  };

  it('should display search results from the initial load', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_ARTWORKS_RESPONSE_DA_VINCI);

    render(<TestRouter initialEntries={['/?q=da%20vinci']} />);

    expect(
      await screen.findByRole('heading', { name: /Mona Lisa/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('searchbox')).toHaveValue('da vinci');
    expect(mockedGetArtworks).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'da vinci' }),
    );
  });

  it('should display a loading indicator during a new navigation', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_ARTWORKS_RESPONSE_DA_VINCI);
    render(<TestRouter initialEntries={['/']} />);
    expect(await screen.findByText(/Mona Lisa/i)).toBeInTheDocument();

    let resolvePromise: (value: ArtworksApiResponse) => void = () => null;
    const longPromise = new Promise<ArtworksApiResponse>((resolve) => {
      resolvePromise = resolve;
    });
    mockedGetArtworks.mockReturnValue(longPromise);

    const searchInput = screen.getByRole('searchbox');
    await user.clear(searchInput);
    await user.type(searchInput, 'picasso');
    await user.click(screen.getByRole('button', { name: /Search/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    resolvePromise(MOCK_ARTWORKS_RESPONSE_PICASSO);

    expect(
      await screen.findByText(/Les Demoiselles d'Avignon/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText(/Mona Lisa/i)).not.toBeInTheDocument();

    expect(mockedGetArtworks).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'picasso' }),
    );
  });

  it('should render a full-width layout when no detail view is active', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_ARTWORKS_RESPONSE_DA_VINCI);

    render(<TestRouter initialEntries={['/']} />);

    await screen.findByRole('heading', { name: /Mona Lisa/i });

    expect(screen.getByRole('main')).toHaveClass('md:col-span-3');
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('should render a two-column layout when a detail view is active', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_ARTWORKS_RESPONSE_DA_VINCI);
    mockedGetArtwork.mockResolvedValue(MOCK_ARTWORK_DETAILS);

    render(<TestRouter initialEntries={['/artworks/1']} />);

    await screen.findAllByRole('heading', { name: /Mona Lisa/i });

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('md:col-span-2');

    const asideElement = screen.getByRole('complementary');
    expect(asideElement).toBeInTheDocument();
  });
});
