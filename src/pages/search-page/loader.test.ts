import { getArtworks } from '@/api/artworks-api';
import type { ArtworksApiResponse } from '@/api/artworks-api.types';
import { loader } from './loader';

vi.mock('@/api/artworks-api');

const mockApiResponse: ArtworksApiResponse = {
  data: [
    {
      id: 1,
      title: 'Starry Night',
      image_id: null,
      date_display: '',
      artist_display: '',
      place_of_origin: '',
      short_description: '',
      description: '',
      dimensions: '',
      medium_display: '',
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

describe('SearchPage Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse search params from the request and call getArtworks with them', async () => {
    vi.mocked(getArtworks).mockResolvedValue(mockApiResponse);
    const request = new Request('http://localhost/search?q=night&page=2');

    const result = await loader({ request, params: {}, context: {} });

    expect(getArtworks).toHaveBeenCalledWith({
      page: 2,
      limit: 16,
      q: 'night',
    });

    expect(result).toEqual({
      artworksResponse: mockApiResponse,
      searchTerm: 'night',
    });
  });

  it('should use default values when search parameters are not provided', async () => {
    vi.mocked(getArtworks).mockResolvedValue(mockApiResponse);
    const request = new Request('http://localhost/search');

    const result = await loader({ request, params: {}, context: {} });

    expect(getArtworks).toHaveBeenCalledWith({
      page: 1,
      limit: 16,
      q: '',
    });

    expect(result).toEqual({
      artworksResponse: mockApiResponse,
      searchTerm: '',
    });
  });
});
