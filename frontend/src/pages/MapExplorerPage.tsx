import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import {
  useLatestAnalysis,
  useStudyAreaDetail,
  useLayerCatalogue,
  useLayerGeoJson,
} from '../hooks/useHaorWatch';
import { LayerDrawer, LayerState } from '../components/map/LayerDrawer';
import { BasemapSwitcher, BasemapType } from '../components/map/BasemapSwitcher';
import { MethodComparisonBar } from '../components/map/MethodComparisonBar';
import { SplitCurtainSlider } from '../components/map/SplitCurtainSlider';
import { MapLegend } from '../components/map/MapLegend';
import { FeatureInspector } from '../components/map/FeatureInspector';
import { MapControls } from '../components/map/MapControls';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { BoundingBox, GeoJsonFeatureProperties, LayerKey } from '../types/api';
import { formatArea } from '../lib/formatters';
import { ApiError } from '../lib/api-client';

// Controller component to smoothly fit map view to the study area boundary
function BoundsFitter({ bounds }: { bounds: BoundingBox | undefined }) {
  const map = useMap();

  useEffect(() => {
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
        animate: false,
      }
    );
  }, [map, bounds]);

  return null;
}

// Controller component for Leaflet custom panes and split-curtain CSS clipping
function PaneClipController({
  isCompareMode,
  splitPosition,
}: {
  isCompareMode: boolean;
  splitPosition: number;
}) {
  const map = useMap();

  useEffect(() => {
    // Ensure custom panes exist
    if (!map.getPane('unetPane')) {
      const pane = map.createPane('unetPane');
      pane.style.zIndex = '410';
    }
    if (!map.getPane('otsuPane')) {
      const pane = map.createPane('otsuPane');
      pane.style.zIndex = '420';
    }

    const unetPane = map.getPane('unetPane');
    const otsuPane = map.getPane('otsuPane');

    if (isCompareMode) {
      if (unetPane) {
        unetPane.style.clipPath = `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`;
      }
      if (otsuPane) {
        otsuPane.style.clipPath = `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)`;
      }
    } else {
      if (unetPane) unetPane.style.clipPath = '';
      if (otsuPane) otsuPane.style.clipPath = '';
    }
  }, [map, isCompareMode, splitPosition]);

  return null;
}

// Individual GeoJSON Layer Wrapper handling on-demand lazy loading and caching
interface MapLayerItemProps {
  analysisId: string;
  layerKey: LayerKey;
  state: LayerState;
  onSelectFeature: (props: GeoJsonFeatureProperties) => void;
  selectedProperties: GeoJsonFeatureProperties | null;
}

const MapLayerItem: React.FC<MapLayerItemProps> = ({
  analysisId,
  layerKey,
  state,
  onSelectFeature,
  selectedProperties,
}) => {
  // Only query GeoJSON when the layer is actively toggled visible
  const { data: geojson } = useLayerGeoJson(analysisId, layerKey, state.visible);

  if (!state.visible || !geojson) {
    return null;
  }

  const getStyle = (feature: any) => {
    const isSelected =
      selectedProperties?.layer_key === layerKey &&
      selectedProperties?.area_km2 === feature?.properties?.area_km2;

    const baseWeight = isSelected ? 3 : 1.5;

    switch (layerKey) {
      case 'study_area':
        return {
          color: '#111827',
          weight: isSelected ? 3 : 2,
          dashArray: '5, 5',
          fillColor: '#111827',
          fillOpacity: 0,
        };
      case 'ml_flood':
        return {
          color: isSelected ? '#0369A1' : '#0284C7',
          weight: baseWeight,
          fillColor: '#0284C7',
          fillOpacity: 0.55 * state.opacity,
        };
      case 'baseline_flood':
        return {
          color: isSelected ? '#4338CA' : '#6366F1',
          weight: baseWeight,
          dashArray: '4, 4',
          fillColor: '#6366F1',
          fillOpacity: 0.45 * state.opacity,
        };
      case 'agricultural_exposure':
        return {
          color: isSelected ? '#B45309' : '#D97706',
          weight: baseWeight,
          fillColor: '#D97706',
          fillOpacity: 0.65 * state.opacity,
        };
      case 'permanent_water':
        return {
          color: '#1E40AF',
          weight: baseWeight,
          fillColor: '#1E40AF',
          fillOpacity: 0.45 * state.opacity,
        };
      case 'validation_reference':
        return {
          color: '#059669',
          weight: 2,
          fillColor: 'transparent',
          fillOpacity: 0,
        };
      default:
        return {
          color: '#6B7280',
          weight: 1,
          fillOpacity: 0.3 * state.opacity,
        };
    }
  };

  const paneName =
    layerKey === 'ml_flood'
      ? 'unetPane'
      : layerKey === 'baseline_flood'
      ? 'otsuPane'
      : undefined;

  return (
    <GeoJSON
      key={`${layerKey}-${state.opacity}-${selectedProperties ? 'selected' : 'default'}`}
      data={geojson as unknown as GeoJSON.GeoJsonObject}
      pane={paneName}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: (e) => {
            e.originalEvent.stopPropagation();
            onSelectFeature(feature.properties);
          },
        });
        layer.bindPopup(`
          <div class="p-1 min-w-[160px]">
            <div class="font-bold text-[10px] uppercase text-stone-500 tracking-wider">${feature.properties?.layer_key}</div>
            <div class="font-semibold text-xs text-stone-900 mt-0.5">${feature.properties?.class_name || 'Classified Feature'}</div>
            <div class="text-xs text-stone-700 font-medium mt-1">Area: <strong>${formatArea(feature.properties?.area_km2)}</strong></div>
          </div>
        `);
      }}
    />
  );
};

export const MapExplorerPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
    refetch: refetchAnalysis,
  } = useLatestAnalysis('pilot-haor');

  const { data: studyArea } = useStudyAreaDetail('pilot-haor');
  const { data: catalogue, isLoading: isCatalogueLoading } = useLayerCatalogue(analysis?.id);

  const [basemap, setBasemap] = useState<BasemapType>('atlas');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [selectedProperties, setSelectedProperties] = useState<GeoJsonFeatureProperties | null>(null);

  // Default visible layers: study_area, ml_flood, and agricultural_exposure
  const [layerStates, setLayerStates] = useState<Record<LayerKey, LayerState>>({
    study_area: { visible: true, opacity: 1 },
    ml_flood: { visible: true, opacity: 0.55 },
    agricultural_exposure: { visible: true, opacity: 0.65 },
    baseline_flood: { visible: false, opacity: 0.45 },
    permanent_water: { visible: false, opacity: 0.45 },
    validation_reference: { visible: false, opacity: 1 },
  });

  // Toggle Layer Visibility
  const handleToggleLayer = (layerKey: LayerKey) => {
    setLayerStates((prev) => {
      const current = prev[layerKey] || { visible: false, opacity: 0.6 };
      return {
        ...prev,
        [layerKey]: {
          ...current,
          visible: !current.visible,
        },
      };
    });
  };

  // Change Layer Opacity
  const handleChangeOpacity = (layerKey: LayerKey, opacity: number) => {
    setLayerStates((prev) => {
      const current = prev[layerKey] || { visible: true, opacity: 0.6 };
      return {
        ...prev,
        [layerKey]: {
          ...current,
          opacity,
        },
      };
    });
  };

  // Toggle U-Net vs Otsu Comparison mode
  const handleToggleCompare = () => {
    setIsCompareMode((prev) => {
      const next = !prev;
      if (next) {
        // Automatically ensure both ml_flood and baseline_flood are visible for comparison
        setLayerStates((current) => ({
          ...current,
          ml_flood: { ...current.ml_flood, visible: true },
          baseline_flood: { ...current.baseline_flood, visible: true },
        }));
      }
      return next;
    });
  };

  // Check if both comparison layers are present in catalogue
  const canCompare = useMemo(() => {
    if (!catalogue?.layers) return false;
    const hasMl = catalogue.layers.some((l) => l.layer_key === 'ml_flood' && l.available);
    const hasBaseline = catalogue.layers.some((l) => l.layer_key === 'baseline_flood' && l.available);
    return hasMl && hasBaseline;
  }, [catalogue]);

  const bounds = studyArea?.bounds || [91.98, 24.60, 92.12, 24.74];
  const centerLat = (bounds[1] + bounds[3]) / 2;
  const centerLng = (bounds[0] + bounds[2]) / 2;

  // Loading Skeleton State
  if (isAnalysisLoading || isCatalogueLoading) {
    return (
      <div className="relative h-full w-full bg-stone-100 flex items-center justify-center">
        <div className="absolute top-4 left-4 z-10 w-80 space-y-3 rounded-xl border border-ink-border bg-white p-4 shadow-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col items-center gap-2 text-stone-500">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-haor-600 border-t-transparent" />
          <span className="text-xs font-semibold">Initializing Cartographic Engine...</span>
        </div>
      </div>
    );
  }

  // 404 ANALYSIS_NOT_FOUND Empty State
  if (
    analysisError instanceof ApiError &&
    (analysisError.code === 'ANALYSIS_NOT_FOUND' || analysisError.status === 404)
  ) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-canvas">
        <EmptyState
          title="No Map Analysis Available"
          description="There is no completed flood analysis for this study area. Ingest and process satellite imagery to explore geospatial layers."
          actionLabel="Check for New Analyses"
          onAction={() => refetchAnalysis()}
        />
      </div>
    );
  }

  // Error State
  if (analysisError || !analysis || !catalogue) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-canvas">
        <ErrorState
          title="Failed to Load Map Explorer"
          message={analysisError ? (analysisError as Error).message : 'Could not retrieve map layers.'}
          onRetry={() => refetchAnalysis()}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none"
    >
      {/* 1. Leaflet Full-Bleed Map Canvas */}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        {/* Basemap Selection */}
        {basemap === 'atlas' ? (
          <TileLayer
            key="atlas-basemap"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            key="satellite-basemap"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        )}

        <BoundsFitter bounds={bounds} />

        <PaneClipController
          isCompareMode={isCompareMode}
          splitPosition={splitPosition}
        />

        {/* Lazy Loaded On-Demand GeoJSON Map Layers */}
        {catalogue.layers.map((layer) => (
          <MapLayerItem
            key={layer.layer_key}
            analysisId={analysis.id}
            layerKey={layer.layer_key}
            state={layerStates[layer.layer_key] || { visible: false, opacity: 0.6 }}
            onSelectFeature={(props) => setSelectedProperties(props)}
            selectedProperties={selectedProperties}
          />
        ))}
      </MapContainer>

      {/* 2. Top-Left Collapsible Layer Drawer */}
      <LayerDrawer
        layers={catalogue.layers}
        layerStates={layerStates}
        onToggleLayer={handleToggleLayer}
        onChangeOpacity={handleChangeOpacity}
        isCompareMode={isCompareMode}
      />

      {/* 3. Top-Right Floating Controls (Basemap Switcher & Method Compare) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2.5">
        <MethodComparisonBar
          isCompareMode={isCompareMode}
          onToggleCompare={handleToggleCompare}
          canCompare={canCompare}
        />

        <BasemapSwitcher
          currentBasemap={basemap}
          onChange={(b) => setBasemap(b)}
        />
      </div>

      {/* 4. Right-Side Custom Zoom & Reset Extent Controls */}
      <div className="absolute right-4 top-20 z-[1000]">
        <MapControls bounds={bounds} />
      </div>

      {/* 5. Interactive Split-Curtain Slider (Active in Compare Mode) */}
      {isCompareMode && (
        <SplitCurtainSlider
          splitPosition={splitPosition}
          onPositionChange={setSplitPosition}
          containerRef={containerRef}
        />
      )}

      {/* 6. Bottom-Left Dynamic Legend & Scope Pill */}
      <MapLegend
        layers={catalogue.layers}
        layerStates={layerStates}
      />

      {/* 7. Bottom-Right Feature Inspector Card */}
      <FeatureInspector
        properties={selectedProperties}
        onClose={() => setSelectedProperties(null)}
      />
    </div>
  );
};
