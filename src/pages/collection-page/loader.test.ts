import { getArtworks } from '@/api/artworks-api';
import { loader } from './loader';
import { MOCK_API_RESPONSE_LIST } from '@/__mocks__/artworks';
import type { LoaderFunctionArgs } from 'react-router-dom';

vi.mock('@/api/artworks-api');

describe('CollectionPage Loader', () => {
  const mockedGetArtworks = vi.mocked(getArtworks);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse page from params and search query from request URL', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    const request = new Request('http://localhost/collection/2?q=cats');
    const params = { page: '2' };

    const result = await loader({
      request,
      params,
    } as unknown as LoaderFunctionArgs);

    expect(mockedGetArtworks).toHaveBeenCalledWith({
      page: 2,
      limit: 16,
      q: 'cats',
    });

    expect(result).toEqual({
      artworksResponse: MOCK_API_RESPONSE_LIST,
      searchTerm: 'cats',
      currentPage: 2,
    });
  });

  it('should use default values when page is not in params and query is not in URL', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    const request = new Request('http://localhost/collection');
    const params = {};

    const result = await loader({ request, params } as LoaderFunctionArgs);

    expect(mockedGetArtworks).toHaveBeenCalledWith({
      page: 1,
      limit: 16,
      q: '',
    });

    expect(result).toEqual({
      artworksResponse: MOCK_API_RESPONSE_LIST,
      searchTerm: '',
      currentPage: 1,
    });
  });

  it('should handle page param being present but search query being absent', async () => {
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
    const request = new Request('http://localhost/collection/3');
    const params = { page: '3' };

    const result = await loader({
      request,
      params,
    } as unknown as LoaderFunctionArgs);

    expect(mockedGetArtworks).toHaveBeenCalledWith({
      page: 3,
      limit: 16,
      q: '',
    });

    expect(result).toEqual({
      artworksResponse: MOCK_API_RESPONSE_LIST,
      searchTerm: '',
      currentPage: 3,
    });
  });
});
