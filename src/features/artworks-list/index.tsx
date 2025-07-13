import type { Artwork } from '@/api/artworks-api.types';
import React from 'react';
import { Loader } from '../ui/loader';

interface ArtworksListProps {
  items: Artwork[];
  isLoading: boolean;
  error: string | null;
}

export class ArtworksList extends React.Component<ArtworksListProps> {
  render() {
    const { items, isLoading, error } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <ul>
        {items.map((artwork) => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    );
  }
}
