import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import { BoundingBox } from '../../types/api';
import { useLayerGeoJson } from '../../hooks/useHaorWatch';
import { formatArea } from '../../lib/formatters';

interface MiniOverviewMapProps {
  analysisId: string | undefined;
  bounds: BoundingBox | undefined;
}

// Controller component to smoothly fit map view to the study area boundary
function BoundsFitter({ bounds }: { bounds: BoundingBox | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds || bounds.length !== 4) return;
    const [west, south, east, north] = bounds;
    // Leaflet LatLngExpression format: [[south, west], [north, east]]
    map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      {
        padding: [24, 24],
        maxZoom: 13,
        animate: false,
      }
    );
  }, [map, bounds]);

  return null;
}

export const MiniOverviewMap: React.FC<MiniOverviewMapProps> = ({
  analysisId,
  bounds = [91.98, 24.60, 92.12, 24.74],
}) => {
  const { data: studyAreaGeoJson } = useLayerGeoJson(analysisId, 'study_area', !!analysisId);
  const { data: mlFloodGeoJson } = useLayerGeoJson(analysisId, 'ml_flood', !!analysisId);
  const { data: exposureGeoJson } = useLayerGeoJson(analysisId, 'agricultural_exposure', !!analysisId);

  const centerLat = (bounds[1] + bounds[3]) / 2;
  const centerLng = (bounds[0] + bounds[2]) / 2;

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-ink-border bg-stone-100 shadow-xs">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        {/* Daylight Cartographic Editorial Basemap (CartoDB Positron) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <BoundsFitter bounds={bounds} />

        {/* 1. Study Area Boundary Layer */}
        {studyAreaGeoJson && (
          <GeoJSON
            key="study-area-layer"
            data={studyAreaGeoJson as unknown as GeoJSON.GeoJsonObject}
            style={() => ({
              color: '#111827',
              weight: 1.5,
              dashArray: '5, 5',
              fillColor: '#111827',
              fillOpacity: 0.02,
            })}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-1">
                  <div class="font-bold text-xs uppercase text-stone-500">Study Area Catchment</div>
                  <div class="font-semibold text-sm text-stone-900">Hakaluki Haor AOI</div>
                  <div class="text-xs text-stone-600 mt-1">Area: ${formatArea(feature.properties?.area_km2)}</div>
                </div>
              `);
            }}
          />
        )}

        {/* 2. Custom U-Net ML Flood Extent Layer */}
        {mlFloodGeoJson && (
          <GeoJSON
            key="ml-flood-layer"
            data={mlFloodGeoJson as unknown as GeoJSON.GeoJsonObject}
            style={() => ({
              color: '#0284C7', // Lively Cerulean Blue
              weight: 1.2,
              fillColor: '#0284C7',
              fillOpacity: 0.55,
            })}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-1">
                  <div class="font-bold text-xs uppercase text-sky-700">U-Net Flood Detection</div>
                  <div class="font-semibold text-sm text-stone-900">Detected Flood Extent</div>
                  <div class="text-xs text-stone-600 mt-1">Segment Area: ${formatArea(feature.properties?.area_km2)}</div>
                  <div class="text-[11px] text-stone-400 mt-0.5">Permanent water masked</div>
                </div>
              `);
            }}
          />
        )}

        {/* 3. Potentially Exposed Agricultural Area Overlay Layer */}
        {exposureGeoJson && (
          <GeoJSON
            key="exposure-layer"
            data={exposureGeoJson as unknown as GeoJSON.GeoJsonObject}
            style={() => ({
              color: '#D97706', // Warm Harvest Ochre
              weight: 1.5,
              fillColor: '#D97706',
              fillOpacity: 0.65,
            })}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-1">
                  <div class="font-bold text-xs uppercase text-amber-700">Land-Cover Overlap</div>
                  <div class="font-semibold text-sm text-stone-900">Potentially Exposed Cropland</div>
                  <div class="text-xs text-stone-600 mt-1">Overlap Area: ${formatArea(feature.properties?.area_km2)}</div>
                  <div class="text-[11px] text-amber-800 font-medium mt-1">Spatial exposure — not verified crop loss</div>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Floating Compact Legend (Top-Left) */}
      <div className="absolute top-3 left-3 z-[1000] rounded-lg border border-stone-200/90 bg-white/95 px-3 py-2 text-xs shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-1.5 font-semibold text-ink mb-1.5 pb-1 border-b border-stone-100">
          <Layers className="h-3.5 w-3.5 text-stone-500" />
          <span>Active Cartography</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-xs border border-sky-600 bg-[#0284C7] opacity-80" />
            <span className="text-ink-muted">U-Net Flood Extent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-xs border border-amber-600 bg-[#D97706] opacity-80" />
            <span className="text-ink-muted">Potentially Exposed Cropland</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-xs border border-dashed border-stone-900 bg-stone-100" />
            <span className="text-ink-muted">Catchment Boundary</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Top-Right): "Open Map Explorer →" */}
      <div className="absolute top-3 right-3 z-[1000]">
        <Link
          to="/map"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-haor-600 hover:text-haor-600 backdrop-blur-xs"
        >
          <span>Open Map Explorer</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Bottom Sub-label indicating map interactivity */}
      <div className="absolute bottom-2 left-3 z-[1000] text-[11px] text-stone-500 bg-white/80 px-2 py-0.5 rounded border border-stone-200/60 pointer-events-none">
        Click polygons to inspect spatial area values
      </div>
    </div>
  );
};
