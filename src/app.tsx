import { Suspense } from 'react';
import { CountryDashboard } from './components/country-dashboard';
import { Loader } from './components/loader';
import { ErrorBoundary } from './components/error-boundary';

export function App() {
  return (
    <div className="min-h-screen font-sans">
      <header className="container-app py-6">
        <h1 className="text-center text-4xl font-bold tracking-tight">
          CO₂ Emissions Dashboard
        </h1>
      </header>

      <main>
        <ErrorBoundary
          fallback={
            <div className="container-app">
              Something went wrong while fetching data.
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="container-app">
                <div className="card">
                  <div className="card-section flex h-96 items-center justify-center">
                    <Loader />
                  </div>
                </div>
              </div>
            }
          >
            <CountryDashboard />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
