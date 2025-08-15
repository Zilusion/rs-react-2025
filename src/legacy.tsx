import { StrictMode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { CollectionPage } from './pages/collection-page/index.tsx';
import { ErrorPage } from './pages/error-page/index.tsx';
import { AboutPage } from './pages/about-page/index.tsx';
import { NotFoundPage } from './pages/not-found-page/index.tsx';
import { Layout } from './features/ui/layout/index.tsx';
import App from './app.tsx';
import { ArtworkDetails } from './features/artwork-details/index.tsx';

const router = createBrowserRouter([
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
            path: 'collection/:page',
            element: <CollectionPage />,
            children: [
              {
                path: ':artworkId',
                element: <ArtworkDetails />,
              },
            ],
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
]);

export default function LegacyApp() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
