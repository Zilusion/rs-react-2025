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
  shouldThrowError: boolean;
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
    shouldThrowError: false,
  };

  render() {
    const { isLoading, error, artworks, searchTerm, shouldThrowError } =
      this.state;

    if (shouldThrowError) {
      throw new Error('I crashed on purpose!');
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
            <h1 className="text-2xl font-bold text-gray-800">
              Search for artworks
            </h1>
            <nav className="w-full sm:w-auto">
              <ArtworksSearch
                initialValue={searchTerm}
                onSearch={this.handleSearch}
              />
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <ArtworksList items={artworks} isLoading={isLoading} error={error} />
        </main>
        <footer className="p-4 text-center">
          <button
            onClick={this.handleThrowError}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Throw Error
          </button>
        </footer>
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
        limit: 16,
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

  handleThrowError = () => {
    this.setState({ shouldThrowError: true });
  };
}
