import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { App } from './app';
import { Layout } from './features/ui/layout';
import { CollectionPage } from './pages/collection-page';
import { loader as collectionLoader } from './pages/collection-page/loader';
import { AboutPage } from './pages/about-page';
import { NotFoundPage } from './pages/not-found-page';
import { ErrorPage } from './pages/error-page';
import { getArtworks } from '@/api/artworks-api';
import { MOCK_API_RESPONSE_LIST } from '@/__mocks__/artworks';

vi.mock('@/api/artworks-api');

describe('App component routing integration', () => {
  const mockedGetArtworks = vi.mocked(getArtworks);

  const setupRouter = (initialEntries: string[]) => {
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
                  element: <div>Home Page Placeholder</div>,
                },
                {
                  path: 'collection/:page',
                  element: <CollectionPage />,
                  loader: collectionLoader,
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
    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetArtworks.mockResolvedValue(MOCK_API_RESPONSE_LIST);
  });

  it('should render the collection page inside the layout on the root path', async () => {
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
