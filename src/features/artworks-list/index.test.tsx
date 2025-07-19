import { render, screen } from '@testing-library/react';
import { ArtworksList } from '.';
import type { Artwork } from '@/api/artworks-api.types';

describe('ArtworksList component', () => {
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
    },
  ];

  it('should render the loader when isLoading is true', () => {
    render(<ArtworksList items={[]} isLoading={true} error={null} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render an error message when error is not null', () => {
    render(
      <ArtworksList items={[]} isLoading={false} error="An error occurred" />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render a list of artworks', () => {
    render(
      <ArtworksList items={mockArtworks} isLoading={false} error={null} />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should render a message when there are no artworks', () => {
    render(<ArtworksList items={[]} isLoading={false} error={null} />);
    expect(
      screen.getByText('No results found for your query.'),
    ).toBeInTheDocument();
  });
});
