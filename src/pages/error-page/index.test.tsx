import { render, screen } from '@testing-library/react';
import { ErrorPage } from './index';
import {
  MemoryRouter,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import { PATHS } from '@/lib/paths';
import type { MockInstance } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    isRouteErrorResponse: vi.fn(),
    useRouteError: vi.fn(),
  };
});

describe('ErrorPage component', () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  const renderErrorPage = () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );
  };

  it('should render a link to the collection page', () => {
    vi.mocked(useRouteError).mockReturnValue('Some error');
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);

    renderErrorPage();

    const homeLink = screen.getByRole('link', { name: /Go Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', PATHS.collection());
  });

  it('should display status and statusText for a route error response', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(true);
    vi.mocked(useRouteError).mockReturnValue({
      status: 404,
      statusText: 'Not Found',
    });

    renderErrorPage();

    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('should display the error message for a standard Error object', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue(new Error('Test message'));

    renderErrorPage();

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display the error itself when it is a string', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue('Test message');

    renderErrorPage();

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display a generic message for unknown error types', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue(null);

    renderErrorPage();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
