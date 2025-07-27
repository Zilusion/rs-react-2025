import { getArtworks, getArtworkImageUrl, getArtwork } from './artworks-api';
import type { ArtworksApiResponse } from './artworks-api.types';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockResponse: ArtworksApiResponse = {
  data: [],
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

describe('Artworks API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getArtworks', () => {
    it('should call the search endpoint when a query is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await getArtworks({ q: 'cats' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('/artworks/search');
      expect(calledUrl).toContain('q=cats');
    });

    it('should call the list endpoint when no query is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await getArtworks();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('/artworks?');
      expect(calledUrl).not.toContain('/search');
    });

    it('should throw an error if the network response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getArtworks({ q: 'cats' })).rejects.toThrow(
        'An error has occurred: 404 Not Found',
      );
    });
  });

  describe('getArtworkImageUrl', () => {
    it('should return a valid IIIF URL when an image_id is provided', () => {
      const imageId = 'abc-123';
      const expectedUrl =
        'https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg';
      expect(getArtworkImageUrl(imageId)).toBe(expectedUrl);
    });

    it('should return null when image_id is null', () => {
      expect(getArtworkImageUrl(null)).toBeNull();
    });
  });

  describe('getArtwork', () => {
    it('should return a valid Artwork object when an ID is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getArtwork(123);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the network response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getArtwork(123)).rejects.toThrow(
        'An error has occurred: 404 Not Found',
      );
    });
  });
});
