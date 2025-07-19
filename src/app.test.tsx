import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './app';

vi.mock('@/api/artworks-api', () => ({
  getArtworks: vi.fn().mockResolvedValue({ data: [] }),
  getArtworkImageUrl: vi.fn().mockReturnValue(null),
}));
vi.mock('@/services/storage', () => ({
  getStoredSearchTerm: vi.fn().mockReturnValue(''),
  setStoredSearchTerm: vi.fn(),
}));

describe('App Component', () => {
  it('should render the search page header by default', () => {
    render(<App />);

    const headerElement = screen.getByText(/Search for artworks/i);
    expect(headerElement).toBeInTheDocument();
  });

  it('should display the error boundary fallback UI when an error occurs in a child component', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    render(<App />);

    const errorButton = screen.getByRole('button', { name: /throw error/i });
    await user.click(errorButton);
    const fallbackMessage = screen.getByText(
      /Something went wrong. Please refresh the page./i,
    );
    expect(fallbackMessage).toBeInTheDocument();
    expect(screen.queryByText(/Search for artworks/i)).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
