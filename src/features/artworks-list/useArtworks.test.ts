import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useArtworks } from './useArtworks';

vi.mock('@tanstack/react-query');
vi.mock('@/api/artworks-api');

describe('useArtworks hook', () => {
  const mockedUseQuery = vi.mocked(useQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useQuery with the correct queryKey containing params', () => {
    const params = { page: 2, q: 'cats', limit: 16 };

    renderHook(() => useArtworks(params));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['artworks', params],
      }),
    );
  });
});
