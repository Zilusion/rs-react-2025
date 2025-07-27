import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { getArtwork } from '@/api/artworks-api';
import { loader as artworkDetailsLoader } from './loader';
import { ArtworkDetails } from '.';
import {
  MOCK_API_RESPONSE_DETAILS,
  MOCK_API_RESPONSE_DETAILS_ANOTHER,
} from '@/__mocks__/artworks';
import type { ArtworkDetailApiResponse } from '@/api/artworks-api.types';
import userEvent from '@testing-library/user-event';

vi.mock('@/api/artworks-api');

const testRoutes = [
  {
    path: '/collection/:page',
    element: (
      <div>
        Collection List <Outlet />
      </div>
    ),
    children: [
      {
        path: ':artworkId',
        element: <ArtworkDetails />,
        loader: artworkDetailsLoader,
      },
    ],
  },
];

describe('ArtworkDetails component', () => {
  const mockedGetArtwork = vi.mocked(getArtwork);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display artwork details correctly', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/collection/1/123'],
    });

    render(<RouterProvider router={router} />);

    expect(mockedGetArtwork).toHaveBeenCalledWith(123);
    expect(
      await screen.findByRole('heading', {
        name: MOCK_API_RESPONSE_DETAILS.data.title,
      }),
    ).toBeInTheDocument();
  });

  it('should display a loader during navigation between artwork details', async () => {
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);
    const router = createMemoryRouter(testRoutes, {
      initialEntries: ['/collection/1/123'],
    });

    render(<RouterProvider router={router} />);
    await screen.findByRole('heading', {
      name: MOCK_API_RESPONSE_DETAILS.data.title,
    });

    let resolvePromise: (value: ArtworkDetailApiResponse) => void;
    mockedGetArtwork.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    act(() => {
      router.navigate('/collection/1/789');
    });

    expect(await screen.findByRole('status')).toBeInTheDocument();

    act(() => {
      resolvePromise(MOCK_API_RESPONSE_DETAILS_ANOTHER);
    });

    expect(
      await screen.findByRole('heading', {
        name: MOCK_API_RESPONSE_DETAILS_ANOTHER.data.title,
      }),
    ).toBeInTheDocument();
  });

  it('should navigate to the collection page with search params preserved on close', async () => {
    const user = userEvent.setup();
    mockedGetArtwork.mockResolvedValue(MOCK_API_RESPONSE_DETAILS);

    const testRoutesWithRoot = [
      {
        path: '/',
        element: <div>You are on the Root Page</div>,
      },
      {
        path: '/collection/:page',
        element: <Outlet />,
        children: [
          {
            path: ':artworkId',
            element: <ArtworkDetails />,
            loader: artworkDetailsLoader,
          },
        ],
      },
    ];

    const router = createMemoryRouter(testRoutesWithRoot, {
      initialEntries: ['/collection/1/123?q=cats'],
    });

    render(<RouterProvider router={router} />);

    const closeButton = await screen.findByRole('button', { name: /close/i });

    await user.click(closeButton);

    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toBe('?q=cats');
    expect(
      await screen.findByText('You are on the Root Page'),
    ).toBeInTheDocument();
  });
});
