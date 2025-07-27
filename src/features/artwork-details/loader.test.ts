import { getArtwork } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { loader } from './loader';

vi.mock('@/api/artworks-api');

const mockApiResponse: { data: Artwork } = {
  data: {
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
};

describe('ArtworkDetails Loader', () => {
  const mockedGetArtwork = vi.mocked(getArtwork);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse search params from the request and call getArtworks with them', async () => {
    mockedGetArtwork.mockResolvedValue(mockApiResponse);
    const request = new Request('http://localhost/artworks/123');

    const result = await loader({
      request,
      params: { artworkId: '123' },
      context: {},
    });

    expect(mockedGetArtwork).toHaveBeenCalledWith(123);

    expect(result).toEqual(mockApiResponse.data);
  });

  it('should throw a Response error if artworkId is missing in params', async () => {
    const request = new Request('http://localhost/artworks/123');

    await expect(
      loader({ request, params: {}, context: {} }),
    ).rejects.toMatchObject({
      status: 400,
      statusText: 'Artwork ID is missing',
    });
  });
});
