import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchPage } from './index';
import { getArtworks } from '@/api/artworks-api';
import { getStoredSearchTerm, setStoredSearchTerm } from '@/services/storage';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';

vi.mock('@/api/artworks-api');
vi.mock('@/services/storage');

const mockResponse: ArtworksApiResponse = {
  data: [
    {
      id: 123,
      title: 'Starry Night',
      artist_display: 'Vincent van Gogh',
      image_id: 'a-real-image-id',
      date_display: '1889',
      place_of_origin: 'Saint-Rémy-de-Provence, France',
      short_description: 'A painting by Vincent van Gogh',
      description: 'A painting by Vincent van Gogh',
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

describe('SearchPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display artworks based on localStorage value on initial render', async () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('night');
    vi.mocked(getArtworks).mockResolvedValue(mockResponse);

    render(<SearchPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(getArtworks).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'night' }),
    );

    expect(await screen.findByText('Starry Night')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should fetch new artworks when a user performs a search', async () => {
    const user = userEvent.setup();
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    vi.mocked(getArtworks).mockResolvedValue(mockResponse);

    render(<SearchPage />);

    const input = screen.getByRole('searchbox');
    const button = screen.getByRole('button', { name: /search/i });
    await user.type(input, 'night');
    await user.click(button);

    expect(setStoredSearchTerm).toHaveBeenCalledWith('night');
    expect(getArtworks).toHaveBeenCalledTimes(2);
    expect(getArtworks).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'night' }),
    );
    expect(await screen.findByText('Starry Night')).toBeInTheDocument();
  });

  it('should display an error message if the API call fails', async () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    const apiError = new Error('API is down');
    vi.mocked(getArtworks).mockRejectedValue(apiError);

    render(<SearchPage />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/API is down/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should handle non-Error exceptions from the API', async () => {
    vi.mocked(getStoredSearchTerm).mockReturnValue('');
    const apiErrorString = 'Something weird happened';
    vi.mocked(getArtworks).mockRejectedValue(apiErrorString);

    render(<SearchPage />);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Error: An unknown error occurred');
  });
});
