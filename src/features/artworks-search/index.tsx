import React from 'react';

interface ArtworksSearchProps {
  initialValue: string;
  onSearch: (searchTerm: string) => void;
}

export class ArtworksSearch extends React.Component<
  ArtworksSearchProps,
  { value: string }
> {
  state = {
    value: this.props.initialValue,
  };

  render() {
    return (
      <form
        action=""
        onSubmit={this.handleSubmit}
        className="flex items-center gap-2"
        role="search"
        aria-label="Artworks search"
      >
        <input
          type="search"
          name="search-term"
          id="search-term"
          value={this.state.value}
          onChange={this.handleChange}
          className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search artworks..."
          role="searchbox"
          aria-label="Search artworks"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          aria-label="Submit search"
        >
          Search
        </button>
      </form>
    );
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value.trimStart() });
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onSearch(this.state.value.trim());
  };
}
