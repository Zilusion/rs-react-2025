import React from 'react';
import { getArtworks } from '@/api/artworks-api';
import type { Artwork } from '@/api/artworks-api.types';
import { getStoredSearchTerm, setStoredSearchTerm } from '@/services/storage';
import { ArtworksSearch } from '@/features/artworks-search';
import { ArtworksList } from '@/features/artworks-list';

interface SearchPageState {
  artworks: Artwork[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

export class SearchPage extends React.Component<
  Record<string, never>,
  SearchPageState
> {
  state: SearchPageState = {
    artworks: [],
    isLoading: true,
    error: null,
    searchTerm: getStoredSearchTerm() || '',
  };

  render() {
    const { isLoading, error, artworks, searchTerm } = this.state;

    return (
      <div>
        <ArtworksSearch
          initialValue={searchTerm}
          onSearch={this.handleSearch}
        />
        <ArtworksList items={artworks} isLoading={isLoading} error={error} />
      </div>
    );
  }

  async componentDidMount(): Promise<void> {
    const { searchTerm } = this.state;
    this.fetchData(searchTerm);
  }

  handleSearch = (searchTerm: string): void => {
    setStoredSearchTerm(searchTerm);
    this.setState({ searchTerm });
    this.fetchData(searchTerm);
  };

  fetchData = async (searchTerm: string): Promise<void> => {
    try {
      this.setState({ isLoading: true, error: null });
      const response = await getArtworks({
        page: 1,
        limit: 5,
        q: searchTerm,
      });

      const artworks = response.data;

      this.setState({
        artworks: artworks,
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
  };
}
