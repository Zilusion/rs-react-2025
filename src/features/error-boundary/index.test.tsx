import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './index';
import type { MockInstance } from 'vitest';

const GoodComponent = () => <div>Everything is awesome!</div>;

const Bomb = () => {
  throw new Error('💥 KABOOM 💥');
  return null;
};

const FallbackComponent = () => <div>Something went wrong</div>;

describe('ErrorBoundary component', () => {
  let consoleErrorSpy: MockInstance;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <GoodComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Everything is awesome!')).toBeInTheDocument();
  });

  it('should render fallback when there is an error', () => {
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Click for details')).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should render a detailed error message in development mode', () => {
    vi.stubEnv('NODE_ENV', 'development');

    const testError = new Error('💥 KABOOM 💥');
    const BombWithSpecificError = () => {
      throw testError;
    };

    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <BombWithSpecificError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Click for details')).toBeInTheDocument();
    expect(screen.getByText(testError.toString())).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    vi.unstubAllEnvs();
  });
});
