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
      <form action="" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="search-term"
          id="search-term"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button type="submit">Search</button>
      </form>
    );
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onSearch(this.state.value);
  };
}
