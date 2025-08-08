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
  it('should render the loader when isLoading is true', () => {
    render(
      <MemoryRouter>
        <ArtworksList items={[]} isLoading={true} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render a list of artworks with correct relative links', () => {
    render(
      <MemoryRouter initialEntries={['/collection/5?q=night']}>
        <ArtworksList items={mockArtworks} isLoading={false} />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(mockArtworks.length);

    const link = screen.getByRole('link', {
      name: new RegExp(MOCK_ARTWORK_WITH_IMAGE.title),
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/${MOCK_ARTWORK_WITH_IMAGE.id}`);
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
