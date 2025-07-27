import { render, screen } from '@testing-library/react';
import { NotFoundPage } from '.';
import { MemoryRouter } from 'react-router-dom';

describe('NotFoundPage component', () => {
  it('should render all content and the home link correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /404/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, the page you are looking for does not exist./i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go Home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
