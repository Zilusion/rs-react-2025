import { render, screen } from '@testing-library/react';
import App from './app';

describe('App Component', () => {
  it('should render the search page header', () => {
    render(<App />);

    const headerElement = screen.getByText(/Search for artworks/i);
    expect(headerElement).toBeInTheDocument();
  });
});
