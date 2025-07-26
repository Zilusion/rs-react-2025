import { NavLink, Link, Outlet } from 'react-router-dom';

export function Layout() {
  const activeLinkStyle = {
    textDecoration: 'underline',
  };

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Art Gallery
          </Link>
          <nav className="flex gap-6 text-lg">
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              end
            >
              Search
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        Art Institute of Chicago API Explorer © 2025
      </footer>
    </div>
  );
}
