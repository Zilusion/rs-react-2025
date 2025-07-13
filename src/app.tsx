import React from 'react';
import { SearchPage } from './pages/search-page';
import { ErrorBoundary } from './features/error-boundary';

class App extends React.Component {
  render() {
    return (
      <>
        <ErrorBoundary
          fallback={
            <h1 className="p-8 text-center text-red-500">
              Something went wrong. Please refresh the page.
            </h1>
          }
        >
          <SearchPage />
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
