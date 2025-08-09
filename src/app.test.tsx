import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './app';
import { Layout } from './features/ui/layout';
import { CollectionPage } from './pages/collection-page';
import { AboutPage } from './pages/about-page';
import { NotFoundPage } from './pages/not-found-page';
import { ErrorPage } from './pages/error-page';
import { getArtworks } from '@/api/artworks-api';
import { MOCK_API_RESPONSE_LIST } from '@/__mocks__/artworks';
import { ThemeProvider } from './contexts/theme';

vi.mock('@/api/artworks-api');

describe('App component routing integration', () => {
  const mockedGetArtworks = vi.mocked(getArtworks);

  const setupRouter = (initialEntries: string[]) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const router = createMemoryRouter(
      [
        {
          element: <App />,
          errorElement: <ErrorPage />,
          children: [
            {
              element: <Layout />,
              children: [
                {
                  path: '/',
                  element: <Navigate to="/collection/1" replace />,
                },
                {
                  path: 'collection/:page?',
                  element: <CollectionPage />,
                },
                {
                  path: 'about',
                  element: <AboutPage />,
                },
              ],
            },
            {
              path: '*',
              element: <NotFoundPage />,
            },
          ],
        },
      ],
      {
        initialEntries,
      },
    );

    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
  });

  it('should render the collection page with data inside the layout', async () => {
    setupRouter(['/collection/1']);

    expect(
      await screen.findByText(MOCK_API_RESPONSE_LIST.data[0].title),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Art Gallery/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Search for artworks/i }),
    ).toBeInTheDocument();
  });

  it('should render the about page when navigating to /about', () => {
    setupRouter(['/about']);

    expect(
      screen.getByRole('link', { name: /Art Gallery/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /About This Project/i }),
    ).toBeInTheDocument();
  });

  it('should render the not found page for an unknown route', () => {
    setupRouter(['/some/bad/route']);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /Art Gallery/i }),
    ).not.toBeInTheDocument();
  });
});
