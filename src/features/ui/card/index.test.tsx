import { Card } from '.';
import { fireEvent, render, screen } from '@testing-library/react';
// --- 1. Импортируем наши готовые моки ---
import {
  MOCK_ARTWORK_WITH_IMAGE,
  MOCK_ARTWORK_WITHOUT_IMAGE,
  MOCK_ARTWORK_ANOTHER,
} from '@/__mocks__/artworks';

describe('Card component', () => {
  vi.mock('@/api/artworks-api', () => ({
    getArtworkImageUrl: (id: string | null) =>
      id ? `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg` : null,
  }));

  it('should render all artwork details and image correctly', () => {
    render(<Card artwork={MOCK_ARTWORK_WITH_IMAGE} />);

    const image = screen.getByRole('img');

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      `https://www.artic.edu/iiif/2/${MOCK_ARTWORK_WITH_IMAGE.image_id}/full/843,/0/default.jpg`,
    );
    expect(
      screen.getByRole('heading', { name: MOCK_ARTWORK_WITH_IMAGE.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_ARTWORK_WITH_IMAGE.artist_display),
    ).toBeInTheDocument();
  });

  it('should render a placeholder instead of the image if no image is provided', () => {
    render(<Card artwork={MOCK_ARTWORK_WITHOUT_IMAGE} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('should render a placeholder if the image fails to load', () => {
    render(<Card artwork={MOCK_ARTWORK_WITH_IMAGE} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('should reset image error state when artwork prop changes', () => {
    const { rerender } = render(<Card artwork={MOCK_ARTWORK_WITH_IMAGE} />);
    fireEvent.error(screen.getByRole('img'));

    expect(screen.getByText('No Image Available')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    rerender(<Card artwork={MOCK_ARTWORK_ANOTHER} />);

    expect(screen.queryByText('No Image Available')).not.toBeInTheDocument();

    const newImage = screen.getByRole('img', {
      name: MOCK_ARTWORK_ANOTHER.title,
    });
    expect(newImage).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_ARTWORK_ANOTHER.artist_display),
    ).toBeInTheDocument();
  });
});
