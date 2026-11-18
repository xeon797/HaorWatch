import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Overview' },
    { to: '/map', label: 'Map' },
    { to: '/evaluation', label: 'Model Evaluation' },
    { to: '/methodology', label: 'Methodology' },
    { to: '/report', label: 'Report' },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 sm:h-[70px] border-b border-ink-border bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Project Logo Only (Generously sized, prominent & crisp) */}
        <div className="flex items-center w-36 sm:w-48">
          <NavLink
            to="/"
            viewTransition
            className="flex items-center group transition-transform duration-200 hover:scale-105 focus:outline-none"
            title="Return to Overview"
            aria-label="HaorWatch Overview Home"
          >
            <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white border border-stone-200/90 p-1.5 shadow-2xs group-hover:border-haor-500 group-hover:shadow-xs transition-all duration-200">
              <img
                src="/logo.png"
                alt="Project Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </NavLink>
        </div>

        {/* Center: ONLY the 5 Requested Navigation Tabs (Spacious, Clear & NO overlapping underlines) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex h-11 items-center rounded-xl bg-stone-100/90 border border-stone-200/90 p-1 shadow-2xs gap-1"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              viewTransition
              className={({ isActive }) =>
                `h-9 px-4 sm:px-5 flex items-center justify-center text-sm font-semibold rounded-lg transition-all duration-200 ease-out select-none ${
                  isActive
                    ? 'bg-white text-ink font-bold shadow-xs border border-stone-200/90'
                    : 'text-ink-muted hover:text-ink hover:bg-white/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Cartographic Coordinate & Telemetry Ribbon (Balanced Proportions) */}
        <div className="hidden md:flex items-center justify-end w-36 sm:w-48">
          <div className="flex h-10 items-center gap-2.5 text-xs font-mono text-stone-600 bg-stone-50/90 border border-stone-200/90 px-3.5 rounded-lg shadow-2xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tabular-nums font-semibold text-stone-800 tracking-tight">24°41′N 92°03′E</span>
          </div>
        </div>

      </div>

      {/* Mobile Tab Links Bar */}
      <div className="flex md:hidden border-t border-stone-200 bg-white px-2.5 py-2 overflow-x-auto gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            viewTransition
            className={({ isActive }) =>
              `h-8.5 shrink-0 rounded-lg px-3.5 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-stone-100 text-ink font-bold shadow-2xs border border-stone-200'
                  : 'text-ink-muted hover:text-ink hover:bg-stone-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};
