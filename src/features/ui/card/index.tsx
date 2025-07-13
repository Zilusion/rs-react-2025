import { getArtworkImageUrl } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import React from 'react';

interface CardProps {
  artwork: Artwork;
}

interface CardState {
  imageError: boolean;
}

export class Card extends React.Component<CardProps, CardState> {
  state: CardState = {
    imageError: false,
  };

  componentDidUpdate(prevProps: CardProps) {
    if (this.props.artwork.id !== prevProps.artwork.id) {
      this.setState({ imageError: false });
    }
  }

  handleImageError = () => {
    this.setState({ imageError: true });
  };

  render() {
    const { artwork } = this.props;
    const { imageError } = this.state;
    const imageUrl = getArtworkImageUrl(artwork.image_id);

    const shouldShowPlaceholder = imageError || !imageUrl;

    return (
      <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-2xl">
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100">
          {shouldShowPlaceholder ? (
            <div className="text-sm text-gray-400">No Image Available</div>
          ) : (
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-full w-full object-cover"
              onError={this.handleImageError}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
            {artwork.title}
          </h3>
          <p className="line-clamp-1 text-sm text-gray-600">
            {artwork.artist_display}
          </p>
        </div>
      </article>
    );
  }
}
