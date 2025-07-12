import React from 'react';
import { getArtworks, getArtworkImageUrl } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';

interface SearchPageState {
  artworks: Artwork[];
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export class SearchPage extends React.Component<
  Record<string, never>,
  SearchPageState
> {
  state: SearchPageState = {
    artworks: [],
    imageUrl: null,
    isLoading: true,
    error: null,
  };
  render() {
    const { isLoading, error, artworks, imageUrl } = this.state;

    if (isLoading) {
      return <div>Загрузка...</div>;
    }

    if (error) {
      return <div>Ошибка: {error}</div>;
    }

    return (
      <div>
        <h1>Галерея котиков</h1>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Первый котик"
            style={{ maxWidth: '300px' }}
          />
        )}

        <hr />
        <ul>
          {artworks.map((artwork) => (
            <li key={artwork.id}>{artwork.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });
      const response = await getArtworks({
        page: 1,
        limit: 5,
        q: 'cats',
      });

      const artworks = response.data;
      const firstImageId = artworks.length > 0 ? artworks[0].image_id : null;
      const imageUrl = getArtworkImageUrl(firstImageId);

      this.setState({
        artworks: artworks,
        imageUrl: imageUrl,
        isLoading: false,
      });
    } catch (err) {
      const error =
        err instanceof Error ? err.message : 'An unknown error occurred';
      this.setState({
        error: error,
        isLoading: false,
      });
    }
  }
}
