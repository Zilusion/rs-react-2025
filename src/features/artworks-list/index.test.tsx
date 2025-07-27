import { render, screen } from '@testing-library/react';
import { ArtworksList } from '.';
import type { Artwork } from '@/api/artworks-api.types';
import {
  MOCK_ARTWORK_ANOTHER,
  MOCK_ARTWORK_WITH_IMAGE,
} from '@/__mocks__/artworks';
import { MemoryRouter } from 'react-router-dom';

const mockArtworks: Artwork[] = [MOCK_ARTWORK_WITH_IMAGE, MOCK_ARTWORK_ANOTHER];

describe('ArtworksList component', () => {
  const mockBuildDetailUrl = vi.fn(
    (artworkId: number) => `/test/url/${artworkId}`,
  );

  beforeEach(() => {
    mockBuildDetailUrl.mockClear();
  });

  it('should render the loader when isLoading is true', () => {
    render(
      <MemoryRouter>
        <ArtworksList
          items={[]}
          isLoading={true}
          buildDetailUrl={mockBuildDetailUrl}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render a list of artworks and call buildDetailUrl for each item', () => {
    render(
      <MemoryRouter>
        <ArtworksList
          items={mockArtworks}
          isLoading={false}
          buildDetailUrl={mockBuildDetailUrl}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(mockArtworks.length);
    expect(mockBuildDetailUrl).toHaveBeenCalledTimes(mockArtworks.length);
    expect(mockBuildDetailUrl).toHaveBeenCalledWith(mockArtworks[0].id);
    expect(mockBuildDetailUrl).toHaveBeenCalledWith(mockArtworks[1].id);

    const link = screen.getByRole('link', {
      name: new RegExp(mockArtworks[0].title),
    });
    expect(link).toHaveAttribute('href', `/test/url/${mockArtworks[0].id}`);
  });

  it('should render a message when there are no artworks', () => {
    render(
      <MemoryRouter>
        <ArtworksList
          items={[]}
          isLoading={false}
          buildDetailUrl={mockBuildDetailUrl}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('No results found for your query.'),
    ).toBeInTheDocument();
  });
});
