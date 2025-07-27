import { render, screen } from '@testing-library/react';
import { ArtworksList } from '.';
import type { Artwork } from '@/api/artworks-api.types';
import { MemoryRouter } from 'react-router-dom';

const mockArtworks: Artwork[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist_display: 'Vincent van Gogh',
    image_id: 'a-real-image-id',
    date_display: '1889',
    place_of_origin: 'Saint-Rémy-de-Provence, France',
    short_description: 'A painting by Vincent van Gogh',
    description: 'A painting by Vincent van Gogh',
    dimensions: '',
    medium_display: '',
  },
  {
    id: 2,
    title: 'The Persistence of Memory',
    artist_display: 'Salvador Dalí',
    image_id: 'another-real-id',
    date_display: '1931',
    place_of_origin: 'Madrid, Spain',
    short_description: 'A painting by Salvador Dalí',
    description: 'A painting by Salvador Dalí',
    dimensions: '',
    medium_display: '',
  },
];

describe('ArtworksList component', () => {
  it('should render the loader when isLoading is true', () => {
    render(
      <MemoryRouter>
        <ArtworksList items={[]} isLoading={true} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should render a list of artworks with correct links', () => {
    render(
      <MemoryRouter initialEntries={['/?q=night&page=1']}>
        <ArtworksList items={mockArtworks} isLoading={false} />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(mockArtworks.length);
    const link = screen.getByRole('link', { name: /Starry Night/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/artworks/1?q=night&page=1');
  });

  it('should render a message when there are no artworks', () => {
    render(
      <MemoryRouter>
        <ArtworksList items={[]} isLoading={false} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('No results found for your query.'),
    ).toBeInTheDocument();
  });
});
