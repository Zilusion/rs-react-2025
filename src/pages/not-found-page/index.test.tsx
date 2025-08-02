import { render, screen } from '@testing-library/react';
import { NotFoundPage } from '.';
import { MemoryRouter } from 'react-router-dom';
import { PATHS } from '@/lib/paths';
import { ThemeProvider } from '@/contexts/theme';

describe('NotFoundPage component', () => {
  it('should render all content and the home link correctly', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, the page you are looking for does not exist./i),
    ).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Go Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', PATHS.collection());
  });
});
