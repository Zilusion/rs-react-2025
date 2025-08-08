import { renderHook } from '@testing-library/react';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { useArtworkDetails } from './useArtworkDetails';

vi.mock('@tanstack/react-query');
vi.mock('@/api/artworks-api');

describe('useArtworkDetails hook', () => {
  const mockedUseQuery = vi.mocked(useQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useQuery with the correct queryKey and enabled: true when artworkId is provided', () => {
    renderHook(() => useArtworkDetails('123'));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['artwork', 123],
        enabled: true,
      }),
    );
  });

  it('should call useQuery with enabled: false when artworkId is undefined', () => {
    renderHook(() => useArtworkDetails(undefined));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['artwork', undefined],
        enabled: false,
      }),
    );
  });

  it('should throw an error from queryFn if it is ever executed with an undefined id', async () => {
    renderHook(() => useArtworkDetails(undefined));

    const queryOptions = mockedUseQuery.mock.calls[0][0];
    const queryFn = queryOptions.queryFn;

    expect(queryFn).toBeDefined();
    await expect(
      typeof queryFn === 'function'
        ? queryFn({} as QueryFunctionContext)
        : Promise.reject(new Error('queryFn is not a function')),
    ).rejects.toThrow('Artwork ID is required to fetch details.');
  });
});
