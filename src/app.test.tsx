import { render, screen } from '@testing-library/react';
import App from './app';

vi.mock('@/api/artworks-api', () => ({
  getArtworks: vi.fn().mockResolvedValue({ data: [] }),
  getArtworkImageUrl: vi.fn().mockReturnValue(null),
}));
vi.mock('@/hooks/use-local-storage-state', () => ({
  useLocalStorageState: vi.fn().mockReturnValue(['', vi.fn()]),
}));

describe('App component', () => {
  it('should render the search page and handle initial data load', async () => {
    render(<App />);

    expect(screen.getByText(/Search for artworks/i)).toBeInTheDocument();
    expect(await screen.findByText(/No results found/i)).toBeInTheDocument();
  });
});
