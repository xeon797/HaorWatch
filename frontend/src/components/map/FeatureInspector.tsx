import React from 'react';
import { X, MapPin, ShieldAlert } from 'lucide-react';
import { GeoJsonFeatureProperties } from '../../types/api';
import { formatArea } from '../../lib/formatters';

interface FeatureInspectorProps {
  properties: GeoJsonFeatureProperties | null;
  onClose: () => void;
}

export const FeatureInspector: React.FC<FeatureInspectorProps> = ({
  properties,
  onClose,
}) => {
  if (!properties) return null;

  const getLayerTitle = (key: string) => {
    switch (key) {
      case 'ml_flood':
        return 'U-Net ML Detected Flood Extent';
      case 'baseline_flood':
        return 'Otsu SAR Baseline Flood';
      case 'agricultural_exposure':
        return 'Potentially Exposed Agricultural Land';
      case 'permanent_water':
        return 'Permanent Water Mask (JRC GSW)';
      case 'study_area':
        return 'Study Area Catchment Boundary';
      case 'validation_reference':
        return 'Independent Validation Reference';
      default:
        return key;
    }
  };

  return (
    <div
      role="region"
      aria-label="Inspected Feature Details"
      className="absolute bottom-6 right-6 z-[1000] w-80 rounded-xl border border-ink-border bg-white/95 p-4 shadow-md backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
        <div>
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-500">
            <MapPin className="h-3 w-3 text-haor-600" />
            <span>Polygon Feature Inspector</span>
          </span>
          <h3 className="mt-0.5 text-sm font-bold text-ink">
            {getLayerTitle(properties.layer_key)}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-ink transition-colors"
          title="Close Feature Inspector"
          aria-label="Close Feature Inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Properties Table */}
      <dl className="mt-3 space-y-2 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-stone-50">
          <dt className="text-ink-muted">Calculated Area:</dt>
          <dd className="font-sans font-bold text-ink tabular-nums text-sm">
            {formatArea(properties.area_km2)}
          </dd>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-stone-50">
          <dt className="text-ink-muted">Classification:</dt>
          <dd className="font-mono text-[11px] font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
            {properties.class_name || 'unclassified'}
          </dd>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-stone-50">
          <dt className="text-ink-muted">Layer Key:</dt>
          <dd className="font-mono text-[11px] text-stone-500">
            {properties.layer_key}
          </dd>
        </div>
      </dl>

      {/* Domain Notice */}
      <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-200/70 bg-amber-50/70 p-2 text-[10px] text-amber-900 leading-snug">
        <ShieldAlert className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
        <span>
          Spatial overlap estimate &bull; Does not constitute confirmed field crop damage or yield loss.
        </span>
      </div>
    </div>
  );
};
