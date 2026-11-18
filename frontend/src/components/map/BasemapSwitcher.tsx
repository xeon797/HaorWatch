import React from 'react';
import { Map, Satellite } from 'lucide-react';

export type BasemapType = 'atlas' | 'satellite';

interface BasemapSwitcherProps {
  currentBasemap: BasemapType;
  onChange: (basemap: BasemapType) => void;
}

export const BasemapSwitcher: React.FC<BasemapSwitcherProps> = ({
  currentBasemap,
  onChange,
}) => {
  return (
    <div
      role="group"
      aria-label="Basemap Style Switcher"
      className="flex h-9 items-center rounded-lg border border-ink-border bg-white p-0.5 shadow-xs backdrop-blur-xs gap-0.5"
    >
      <button
        type="button"
        onClick={() => onChange('atlas')}
        className={`h-7.5 flex items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all duration-200 ${
          currentBasemap === 'atlas'
            ? 'bg-stone-100 text-ink shadow-2xs font-bold'
            : 'text-ink-muted hover:text-ink hover:bg-stone-50'
        }`}
        title="Daylight Cartographic Atlas (CartoDB Positron)"
      >
        <Map className="h-3.5 w-3.5 text-stone-500 shrink-0" />
        <span>Atlas</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('satellite')}
        className={`h-7.5 flex items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all duration-200 ${
          currentBasemap === 'satellite'
            ? 'bg-stone-100 text-ink shadow-2xs font-bold'
            : 'text-ink-muted hover:text-ink hover:bg-stone-50'
        }`}
        title="Optical Satellite Imagery (Esri World Imagery)"
      >
        <Satellite className="h-3.5 w-3.5 text-haor-600 shrink-0" />
        <span>Satellite</span>
      </button>
    </div>
  );
};
