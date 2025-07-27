import React, { useState } from 'react';
import { Form } from 'react-router-dom';

interface ArtworksSearchProps {
  initialValue: string;
}

export function ArtworksSearch({ initialValue }: ArtworksSearchProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trimStart());
  };

  return (
    <Form
      action=""
      className="flex items-center gap-2"
      role="search"
      aria-label="Artworks search"
    >
      <input
        type="search"
        name="q"
        id="search-term"
        value={value}
        onChange={handleChange}
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
    </Form>
  );
}
