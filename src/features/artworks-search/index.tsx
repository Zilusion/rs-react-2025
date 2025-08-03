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
      action="/collection/1"
      className="flex items-center gap-2 rounded bg-white p-4 shadow dark:bg-gray-900"
      role="search"
      aria-label="Artworks search"
    >
      <input
        type="search"
        name="q"
        id="search-term"
        value={value}
        onChange={handleChange}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        placeholder="Search artworks..."
        role="searchbox"
        aria-label="Search artworks"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        aria-label="Submit search"
      >
        Search
      </button>
    </Form>
  );
}
