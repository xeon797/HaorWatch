import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { LayerCatalogueItem, LayerKey } from '../../types/api';
import { LayerState } from './LayerDrawer';
import { formatArea } from '../../lib/formatters';

interface MapLegendProps {
  layers: LayerCatalogueItem[];
  layerStates: Record<LayerKey, LayerState>;
}

export const MapLegend: React.FC<MapLegendProps> = ({ layers, layerStates }) => {
  const activeLayers = layers.filter(
    (l) => l.available && layerStates[l.layer_key]?.visible
  );

  const getSwatch = (key: LayerKey) => {
    switch (key) {
      case 'study_area':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border-2 border-dashed border-stone-900 bg-transparent" />
        );
      case 'ml_flood':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border border-sky-700 bg-[#0284C7] opacity-90" />
        );
      case 'baseline_flood':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border border-dashed border-indigo-700 bg-[#6366F1] opacity-90" />
        );
      case 'agricultural_exposure':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border border-amber-700 bg-[#D97706] opacity-90" />
        );
      case 'permanent_water':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border border-blue-900 bg-[#1E40AF] opacity-90" />
        );
      case 'validation_reference':
        return (
          <span className="h-2.5 w-4 shrink-0 rounded-xs border-2 border-emerald-600 bg-transparent" />
        );
      default:
        return <span className="h-2.5 w-4 shrink-0 rounded-xs bg-stone-400" />;
    }
  };

  return (
    <div className="absolute bottom-6 left-4 z-[1000] flex flex-col gap-2 max-w-sm pointer-events-auto">
      {/* Dynamic Active Layers Legend */}
      <div className="rounded-xl border border-ink-border bg-white/95 px-3.5 py-2.5 text-xs shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-ink mb-2 pb-1 border-b border-stone-100 text-[11px]">
          <Layers className="h-3.5 w-3.5 text-haor-600" />
          <span>Active Cartography Legend</span>
        </div>

        {activeLayers.length === 0 ? (
          <div className="text-[11px] text-stone-500 italic py-0.5">
            No layers currently visible
          </div>
        ) : (
          <ul className="space-y-1.5">
            {activeLayers.map((layer) => (
              <li
                key={layer.layer_key}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  {getSwatch(layer.layer_key)}
                  <span className="text-ink font-medium leading-none">
                    {layer.display_name}
                  </span>
                </div>
                <span className="font-sans text-[11px] font-bold text-ink-muted tabular-nums">
                  {formatArea(layer.area_km2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subtle 1-line Domain Scope Pill */}
      <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/95 px-3 py-1 text-[11px] text-stone-700 shadow-2xs backdrop-blur-xs">
        <ShieldCheck className="h-3.5 w-3.5 text-amber-700 shrink-0" />
        <span>
          Sentinel-1 SAR observation &bull; Potential agricultural exposure only (not confirmed crop loss)
        </span>
      </div>
    </div>
  );
};
