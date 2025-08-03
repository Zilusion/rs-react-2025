import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './index';
import { ThemeProvider } from '@/contexts/theme';

describe('Layout component', () => {
  const TestWrapper = ({
    children,
    initialEntries = ['/'],
  }: {
    children: React.ReactNode;
    initialEntries?: string[];
  }) => {
    return (
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ThemeProvider>
    );
  };

  it('should render the main layout and the child route component via Outlet', () => {
    const ChildComponent = () => <div>Child Route Content</div>;

    render(
      <TestWrapper>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ChildComponent />} />
          </Route>
        </Routes>
      </TestWrapper>,
    );

    expect(
      screen.getByRole('link', { name: /Art Gallery/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(/API Explorer © 2025/i)).toBeInTheDocument();
    expect(screen.getByText('Child Route Content')).toBeInTheDocument();
  });

  it('should apply active styles to the "Search" NavLink when on the root path', () => {
    render(
      <TestWrapper>
        <Layout />
      </TestWrapper>,
    );

    const searchLink = screen.getByRole('link', { name: 'Search' });
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(searchLink).toHaveStyle('text-decoration: underline');
    expect(aboutLink).not.toHaveStyle('text-decoration: underline');
  });

  it('should apply active styles to the "About" NavLink when on the about path', () => {
    render(
      <TestWrapper initialEntries={['/about']}>
        <Layout />
      </TestWrapper>,
    );

    const searchLink = screen.getByRole('link', { name: 'Search' });
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(searchLink).not.toHaveStyle('text-decoration: underline');
    expect(aboutLink).toHaveStyle('text-decoration: underline');
  });
});
