import { getArtwork } from '@/api/artworks-api';
import { loader } from './loader';
import { MOCK_API_RESPONSE_DETAILS } from '@/__mocks__/artworks';

vi.mock('@/api/artworks-api');

describe('ArtworkDetails Loader', () => {
  const mockedGetArtwork = vi.mocked(getArtwork);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse search params from the request and call getArtworks with them', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    const request = new Request('http://localhost/artworks/123');

    const result = await loader({
      request,
      params: { artworkId: '123' },
      context: {},
    });

    expect(mockedGetArtwork).toHaveBeenCalledWith(123);

    expect(result).toEqual(MOCK_API_RESPONSE_DETAILS.data);
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
