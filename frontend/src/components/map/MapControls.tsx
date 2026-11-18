import React from 'react';
import { useMap } from 'react-leaflet';
import { Plus, Minus, Focus } from 'lucide-react';
import { BoundingBox } from '../../types/api';

interface MapControlsProps {
  bounds: BoundingBox | undefined;
}

export const MapControls: React.FC<MapControlsProps> = ({ bounds }) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetExtent = () => {
    if (!bounds || bounds.length !== 4) return;
    const [west, south, east, north] = bounds;
    map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      {
        padding: [30, 30],
        maxZoom: 13,
        animate: true,
      }
    );
  };

  return (
    <div className="flex flex-col rounded-lg border border-ink-border bg-white shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={handleZoomIn}
        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-stone-50 hover:text-haor-600 transition-colors border-b border-stone-100"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleZoomOut}
        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-stone-50 hover:text-haor-600 transition-colors border-b border-stone-100"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <Minus className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleResetExtent}
        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-stone-50 hover:text-haor-600 transition-colors"
        title="Reset to Study Area Catchment Extent"
        aria-label="Reset Extent"
      >
        <Focus className="h-4 w-4 text-stone-600" />
      </button>
    </div>
  );
};
