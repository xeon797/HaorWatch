import React, { useState } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { LayerCatalogueItem, LayerKey } from '../../types/api';
import { formatArea } from '../../lib/formatters';

export interface LayerState {
  visible: boolean;
  opacity: number; // 0 to 1
}

interface LayerDrawerProps {
  layers: LayerCatalogueItem[];
  layerStates: Record<LayerKey, LayerState>;
  onToggleLayer: (layerKey: LayerKey) => void;
  onChangeOpacity: (layerKey: LayerKey, opacity: number) => void;
  isCompareMode: boolean;
}

export const LayerDrawer: React.FC<LayerDrawerProps> = ({
  layers,
  layerStates,
  onToggleLayer,
  onChangeOpacity,
  isCompareMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const activeCount = Object.values(layerStates).filter((s) => s.visible).length;

  const renderSwatch = (layerKey: LayerKey) => {
    switch (layerKey) {
      case 'study_area':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border-2 border-dashed border-stone-900 bg-transparent"
            title="Boundary Perimeter"
          />
        );
      case 'ml_flood':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border border-sky-700 bg-[#0284C7]"
            title="U-Net Flood Extent"
          />
        );
      case 'baseline_flood':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border border-dashed border-indigo-700 bg-[#6366F1]"
            title="Otsu Baseline Flood"
          />
        );
      case 'agricultural_exposure':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border border-amber-700 bg-[#D97706]"
            title="Potentially Exposed Agricultural Land"
          />
        );
      case 'permanent_water':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border border-blue-900 bg-[#1E40AF]"
            title="JRC Permanent Water Mask"
          />
        );
      case 'validation_reference':
        return (
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border-2 border-emerald-600 bg-transparent"
            title="Independent Validation Reference"
          />
        );
      default:
        return <span className="h-3.5 w-3.5 shrink-0 rounded-xs bg-stone-400" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className="absolute top-4 left-4 z-[1000]">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 rounded-lg border border-ink-border bg-white px-3 py-2 text-xs font-bold text-ink shadow-xs hover:bg-stone-50 hover:border-haor-600 transition-all"
          title="Open Map Layer Catalogue"
        >
          <Layers className="h-4 w-4 text-haor-600" />
          <span>Layers</span>
          <span className="rounded-full bg-haor-50 border border-haor-200 px-1.5 py-0.2 text-[11px] font-semibold text-haor-800 tabular-nums">
            {activeCount}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Map Layer Drawer"
      className="absolute top-4 left-4 z-[1000] w-80 max-h-[calc(100vh-100px)] flex flex-col rounded-xl border border-ink-border bg-white/95 shadow-md backdrop-blur-xs transition-all overflow-hidden"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-stone-50/70">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-haor-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Map Layers
          </h2>
          <span className="rounded-full bg-stone-200/80 px-2 py-0.5 text-[11px] font-semibold text-ink-muted tabular-nums">
            {activeCount}/{layers.length} active
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-ink transition-colors"
          title="Collapse Layer Drawer"
          aria-label="Collapse Layer Drawer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {isCompareMode && (
        <div className="border-b border-indigo-100 bg-indigo-50/70 px-4 py-2 text-[11px] text-indigo-900 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
          <span>
            Split-Curtain active: <strong>U-Net ML</strong> (Left) vs <strong>Otsu</strong> (Right)
          </span>
        </div>
      )}

      {/* Layer List Scrollable */}
      <div className="overflow-y-auto divide-y divide-stone-100 p-2 space-y-1">
        {layers.map((layer) => {
          const state = layerStates[layer.layer_key] || { visible: false, opacity: 0.6 };
          const isAvailable = layer.available;
          const isTooltipOpen = activeTooltip === layer.layer_key;

          return (
            <div
              key={layer.layer_key}
              className={`rounded-lg p-2.5 transition-colors ${
                !isAvailable
                  ? 'bg-stone-50/60 opacity-60'
                  : state.visible
                  ? 'bg-teal-50/30 border border-teal-100/70'
                  : 'hover:bg-stone-50/80 border border-transparent'
              }`}
            >
              {/* Row: Switch + Swatch + Title + Unavailable badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Native accessible toggle switch styled with Tailwind */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.visible && isAvailable}
                      disabled={!isAvailable}
                      onChange={() => onToggleLayer(layer.layer_key)}
                      className="sr-only peer"
                      aria-label={`Toggle ${layer.display_name}`}
                    />
                    <div className="w-7 h-4 bg-stone-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-haor-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-haor-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                  </label>

                  {renderSwatch(layer.layer_key)}

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-ink leading-tight">
                        {layer.display_name}
                      </span>
                      {layer.model_version && (
                        <span className="font-mono text-[10px] text-stone-400">
                          {layer.model_version}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Info Tooltip Toggle & Availability / Area */}
                <div className="flex items-center gap-1 shrink-0">
                  {!isAvailable ? (
                    <span className="rounded bg-stone-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
                      Unavailable
                    </span>
                  ) : (
                    <span className="font-sans text-[11px] font-medium text-ink-muted tabular-nums">
                      {formatArea(layer.area_km2)}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTooltip(isTooltipOpen ? null : layer.layer_key)}
                    className="rounded p-1 text-stone-400 hover:text-ink hover:bg-stone-100 transition-colors"
                    title="Layer Information"
                    aria-label={`Info for ${layer.display_name}`}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progressive Disclosure Tooltip / Popover (Minimal text rule) */}
              {isTooltipOpen && (
                <div className="mt-2 rounded-md border border-stone-200 bg-white p-2.5 text-[11px] text-ink-muted shadow-2xs space-y-1 animate-in fade-in duration-150">
                  <p className="leading-relaxed text-stone-700">{layer.description}</p>
                  {layer.source_date && (
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                      <Calendar className="h-3 w-3" />
                      <span>Source acquisition: {layer.source_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Opacity Slider (Revealed only when layer is active & available) */}
              {isAvailable && state.visible && (
                <div className="mt-2.5 pt-2 border-t border-stone-100/80 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
                  <label
                    htmlFor={`opacity-${layer.layer_key}`}
                    className="shrink-0 flex items-center gap-1 text-stone-500"
                  >
                    {state.opacity === 0 ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                    <span>Opacity</span>
                  </label>

                  <input
                    id={`opacity-${layer.layer_key}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={Math.round(state.opacity * 100)}
                    onChange={(e) =>
                      onChangeOpacity(layer.layer_key, Number(e.target.value) / 100)
                    }
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-haor-600 focus:outline-hidden focus:ring-1 focus:ring-haor-600"
                    title={`Adjust opacity: ${Math.round(state.opacity * 100)}%`}
                    aria-label={`${layer.display_name} Opacity`}
                  />

                  <span className="font-mono text-[10px] font-semibold text-stone-700 tabular-nums w-8 text-right">
                    {Math.round(state.opacity * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Drawer Footer Disclaimer */}
      <div className="border-t border-stone-200 bg-stone-50/90 px-3 py-2 text-[10px] text-stone-500 leading-tight">
        Spatial intersection denotes <strong>potential exposure</strong>, not verified crop loss.
      </div>
    </aside>
  );
};
