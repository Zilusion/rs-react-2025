import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
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
});
