import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SearchPage } from './pages/search-page/index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404</div>,
    children: [
      {
        index: true,
        element: <SearchPage />,
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
