import { render, screen } from '@testing-library/react';
import { ErrorPage } from './index';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import type { MockInstance } from 'vitest';

vi.mock('react-router-dom', () => ({
  isRouteErrorResponse: vi.fn(),
  useRouteError: vi.fn(),
}));

describe('ErrorPage component', () => {
  let consoleErrorSpy: MockInstance;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  });
  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it('should display status and statusText for a route error response', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(true);
    vi.mocked(useRouteError).mockReturnValue({
      status: 404,
      statusText: 'Not Found',
    });

    render(<ErrorPage />);

    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('should display the error message for a standard Error object', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue(new Error('Test message'));

    render(<ErrorPage />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display the error itself when it is a string', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue('Test message');

    render(<ErrorPage />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should display a generic message for unknown error types', () => {
    vi.mocked(isRouteErrorResponse).mockReturnValue(false);
    vi.mocked(useRouteError).mockReturnValue(null);

    render(<ErrorPage />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
