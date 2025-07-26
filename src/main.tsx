import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SearchPage } from './pages/search-page/index.tsx';
import { loader as searchPageLoader } from './pages/search-page/loader.ts';
import { ErrorPage } from './pages/error-page/index.tsx';
import { AboutPage } from './pages/about-page/index.tsx';
import { NotFoundPage } from './pages/not-found-page/index.tsx';
import { Layout } from './features/ui/layout/index.tsx';
import App from './app.tsx';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <SearchPage />,
            loader: searchPageLoader,
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
      <RouterProvider router={router} />
    </StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found");
}
