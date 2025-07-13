import type { ReactNode, ErrorInfo } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div
            className="m-4 rounded border border-red-400 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            <h2 className="text-lg font-bold">Something went wrong.</h2>
            <details className="mt-2 whitespace-pre-wrap">
              <summary>Click for details</summary>
              {this.state.error && <p>{this.state.error.toString()}</p>}
              {this.state.errorInfo && (
                <p>{this.state.errorInfo.componentStack}</p>
              )}
            </details>
          </div>
        );
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}
