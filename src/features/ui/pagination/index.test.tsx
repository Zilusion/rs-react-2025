import { render, screen } from '@testing-library/react';
import { Pagination } from '.';
import { MemoryRouter } from 'react-router-dom';

describe('Pagination component', () => {
  it('should render both Previous and Next links when not on the first or last page', () => {
    render(
      <MemoryRouter initialEntries={['/collection/5']}>
        <Pagination currentPage={5} totalPages={10} />
      </MemoryRouter>,
    );

    const previousLink = screen.getByRole('link', { name: /Previous/i });
    expect(previousLink).toBeInTheDocument();
    expect(previousLink).toHaveAttribute('href', '/collection/4');

    const nextLink = screen.getByRole('link', { name: /Next/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/collection/6');
  });

  it('should only render the Next link when on the first page', () => {
    render(
      <MemoryRouter initialEntries={['/collection/1']}>
        <Pagination currentPage={1} totalPages={10} />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { name: /Previous/i }),
    ).not.toBeInTheDocument();
    const nextLink = screen.getByRole('link', { name: /Next/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/collection/2');
  });

  it('should only render the Previous link when on the last page', () => {
    render(
      <MemoryRouter initialEntries={['/collection/10']}>
        <Pagination currentPage={10} totalPages={10} />
      </MemoryRouter>,
    );

    const previousLink = screen.getByRole('link', { name: /Previous/i });
    expect(previousLink).toBeInTheDocument();
    expect(previousLink).toHaveAttribute('href', '/collection/9');
    expect(
      screen.queryByRole('link', { name: /Next/i }),
    ).not.toBeInTheDocument();
  });
});
