import { render, screen } from '@testing-library/react';
import { AboutPage } from '.';
import { MemoryRouter } from 'react-router-dom';

describe('AboutPage component', () => {
  it('should render all content and links correctly', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /About/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Sudorgin Daniil/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /Learn more about the RS School React Course/i,
      }),
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(
      screen.getByRole('link', { name: /Back to Search/i }),
    ).toHaveAttribute('href', '/');
  });
});
