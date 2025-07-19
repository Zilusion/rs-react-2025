import type { Artwork } from '@/api/artworks-api.types';
import { Card } from '.';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Card component', () => {
  const mockArtworkWithImage: Artwork = {
    id: 123,
    title: 'Starry Night',
    artist_display: 'Vincent van Gogh',
    image_id: 'a-real-image-id',
    date_display: '1889',
    place_of_origin: 'Saint-Rémy-de-Provence, France',
    short_description: 'A painting by Vincent van Gogh',
    description: 'A painting by Vincent van Gogh',
  };

  const mockArtworkWithoutImage: Artwork = {
    ...mockArtworkWithImage,
    id: 456,
    image_id: null,
  };

  const anotherMockArtwork: Artwork = {
    ...mockArtworkWithImage,
    id: 789,
    title: 'The Persistence of Memory',
    artist_display: 'Salvador Dalí',
    image_id: 'another-real-id',
  };

  vi.mock('@/api/artworks-api', () => ({
    getArtworkImageUrl: (id: string | null) =>
      id ? `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg` : null,
  }));

  it('should render all artwork details and image correctly', () => {
    render(<Card artwork={mockArtworkWithImage} />);

    const image = screen.getByRole('img');

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://www.artic.edu/iiif/2/a-real-image-id/full/843,/0/default.jpg',
    );
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: mockArtworkWithImage.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockArtworkWithImage.artist_display),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockArtworkWithImage.date_display)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockArtworkWithImage.place_of_origin)),
    ).toBeInTheDocument();
  });

  it('should render a placeholder instead of the image if no image is provided', () => {
    render(<Card artwork={mockArtworkWithoutImage} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('should render a placeholder if the image fails to load', () => {
    render(<Card artwork={mockArtworkWithImage} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('should reset image error state when artwork prop changes', () => {
    const { rerender } = render(<Card artwork={mockArtworkWithImage} />);
    fireEvent.error(screen.getByRole('img'));

    expect(screen.getByText('No Image Available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    rerender(<Card artwork={anotherMockArtwork} />);

    expect(screen.queryByText('No Image Available')).not.toBeInTheDocument();

    const newImage = screen.getByRole('img', {
      name: anotherMockArtwork.title,
    });
    expect(newImage).toBeInTheDocument();
    expect(
      screen.getByText(anotherMockArtwork.artist_display),
    ).toBeInTheDocument();
  });
});
