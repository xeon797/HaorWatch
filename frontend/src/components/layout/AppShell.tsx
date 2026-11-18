import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const isMapRoute = location.pathname === '/map';

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink font-sans">
      <Navbar />
      {isMapRoute ? (
        // Full-bleed cartographic canvas without container padding or page scroll
        <main
          key={location.pathname}
          className="h-[calc(100vh-64px)] sm:h-[calc(100vh-70px)] w-full overflow-hidden relative animate-tab-switch motion-reduce:animate-none"
        >
          <Outlet />
        </main>
      ) : (
        // Standard editorial reading layout with container padding and footer
        <>
          <main className="flex-1">
            <div
              key={location.pathname}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-tab-switch motion-reduce:animate-none"
            >
              <Outlet />
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};
