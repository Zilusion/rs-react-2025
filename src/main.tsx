import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { CollectionPage } from './pages/collection-page/index.tsx';
import { loader as collectionPageLoader } from './pages/collection-page/loader.ts';
import { ErrorPage } from './pages/error-page/index.tsx';
import { AboutPage } from './pages/about-page/index.tsx';
import { NotFoundPage } from './pages/not-found-page/index.tsx';
import { Layout } from './features/ui/layout/index.tsx';
import App from './app.tsx';
import { ArtworkDetails } from './features/artwork-details/index.tsx';
import { loader as artworkDetailsLoader } from './features/artwork-details/loader.ts';
import { ThemeProvider } from './contexts/theme';

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
            loader: collectionPageLoader,
            children: [
              {
                path: ':artworkId',
                element: <ArtworkDetails />,
                loader: artworkDetailsLoader,
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

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
