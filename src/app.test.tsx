import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import App from './app';

vi.mock('@/pages/search-page', () => ({
  SearchPage: vi.fn(),
}));
const { SearchPage } = await import('@/pages/search-page');

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main layout with the page content inside', () => {
    vi.mocked(SearchPage).mockImplementation(() => (
      <div>This is the Search Page</div>
    ));

    const routes = [
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <SearchPage /> }],
      },
    ];
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(<RouterProvider router={router} />);

    expect(screen.getByText('This is the Search Page')).toBeInTheDocument();
  });
});
