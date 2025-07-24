import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from './features/error-boundary';

function App() {
  return (
    <>
      <ErrorBoundary
        fallback={
          <h1 className="p-8 text-center text-red-500">
            Something went wrong. Please refresh the page.
          </h1>
        }
      >
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

export default App;
