import { NavLink, Link, Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '../theme-switcher';
import { Flyout } from '@/features/flyout';

export function Layout() {
  const activeLinkStyle = {
    textDecoration: 'underline',
  };

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-gray-50 transition-colors dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors dark:border-gray-700 dark:bg-gray-800/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 transition-colors dark:text-gray-100"
          >
            Art Gallery
          </Link>
          <nav className="flex gap-6 text-lg">
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
              end
            >
              Search
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
            >
              About
            </NavLink>
          </nav>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="transition-colors">
        <Outlet />
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 transition-colors dark:text-gray-400">
        Art Institute of Chicago API Explorer © 2025
      </footer>

      <Flyout />
    </div>
  );
}
