import React, { useState } from 'react';
import { useLatestAnalysis, useDataSources } from '../hooks/useHaorWatch';
import { formatDate, formatDateRange } from '../lib/formatters';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  BookOpen,
  Satellite,
  SlidersHorizontal,
  Waves,
  GitFork,
  Sprout,
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Radio,
} from 'lucide-react';

type PipelineStepId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6';

export const MethodologyPage: React.FC = () => {
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
    refetch: refetchAnalysis,
  } = useLatestAnalysis('pilot-haor');

  const {
    data: sourcesData,
    isLoading: isSourcesLoading,
    error: sourcesError,
    refetch: refetchSources,
  } = useDataSources(analysis?.id);

  const [activeStep, setActiveStep] = useState<PipelineStepId>('s3');

  if (isAnalysisLoading || isSourcesLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (analysisError || sourcesError || !analysis || !sourcesData) {
    return (
      <ErrorState
        title="Unable to Load Methodology & Provenance"
        message={
          analysisError
            ? (analysisError as Error).message
            : sourcesError
            ? (sourcesError as Error).message
            : 'Methodology data is currently unavailable.'
        }
        onRetry={() => {
          refetchAnalysis();
          refetchSources();
        }}
      />
    );
  }

  const { model, baseline, permanent_water_mask, summary } = analysis;

  const steps = [
    {
      id: 's1' as PipelineStepId,
      number: '01',
      title: 'Sentinel-1 SAR',
      subtitle: 'Radar Ingestion',
      icon: <Satellite className="h-4 w-4" />,
      badge: null,
    },
    {
      id: 's2' as PipelineStepId,
      number: '02',
      title: 'Preprocessing',
      subtitle: 'Calibration & Grid',
      icon: <SlidersHorizontal className="h-4 w-4" />,
      badge: null,
    },
    {
      id: 's3' as PipelineStepId,
      number: '03',
      title: 'JRC Water Mask',
      subtitle: 'Perennial Exclusion',
      icon: <Waves className="h-4 w-4" />,
      badge: permanent_water_mask.applied ? (
        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold">
          Applied
        </span>
      ) : (
        <span className="rounded-full bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 text-[10px] font-bold">
          Unapplied
        </span>
      ),
    },
    {
      id: 's4' as PipelineStepId,
      number: '04',
      title: 'Dual Segmenter',
      subtitle: 'U-Net vs. Otsu',
      icon: <GitFork className="h-4 w-4" />,
      badge: (
        <span className="rounded-full bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.2 text-[10px] font-mono font-semibold">
          ML+Otsu
        </span>
      ),
    },
    {
      id: 's5' as PipelineStepId,
      number: '05',
      title: 'Cropland Overlay',
      subtitle: 'WorldCover 10m',
      icon: <Sprout className="h-4 w-4" />,
      badge: null,
    },
    {
      id: 's6' as PipelineStepId,
      number: '06',
      title: 'Bilingual Briefing',
      subtitle: 'Bangla & English',
      icon: <FileText className="h-4 w-4" />,
      badge: (
        <span className="rounded-full bg-stone-100 text-stone-700 border border-stone-200 px-1.5 py-0.2 text-[10px] font-semibold">
          Template
        </span>
      ),
    },
  ];

  const renderActiveStepDetail = () => {
    switch (activeStep) {
      case 's1':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <Satellite className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 01: Sentinel-1 SAR Acquisition & Calibration
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Copernicus C-SAR IW GRD
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Observation Window</span>
                <div className="font-sans font-extrabold text-ink mt-0.5 tabular-nums">
                  {formatDateRange(analysis.observation_start, analysis.observation_end)}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Polarizations</span>
                <div className="font-mono font-bold text-ink mt-0.5">VV & VH Dual-Pol</div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Pixel Resolution</span>
                <div className="font-sans font-extrabold text-ink mt-0.5 tabular-nums">10.0 meters</div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Orbit Correction</span>
                <div className="font-sans font-bold text-emerald-800 mt-0.5">Precise Ephemeris</div>
              </div>
            </div>
          </div>
        );

      case 's2':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-haor-600 border border-teal-100">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 02: Radiometric Preprocessing, Alignment & Nodata Masking
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                UTM Zone 46N / EPSG:4326
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Valid Pixels</span>
                <div className="font-mono font-extrabold text-ink mt-0.5 tabular-nums">
                  {summary.valid_pixel_count ? summary.valid_pixel_count.toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Nodata Masked</span>
                <div className="font-mono font-extrabold text-ink mt-0.5 tabular-nums">
                  {summary.nodata_pixel_count ? summary.nodata_pixel_count.toLocaleString() : '0'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Catchment Area</span>
                <div className="font-sans font-extrabold text-ink mt-0.5 tabular-nums">
                  {summary.study_area_km2 ? `${summary.study_area_km2.toFixed(2)} km²` : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Speckle Filter</span>
                <div className="font-sans font-bold text-stone-700 mt-0.5">Refined Lee (3×3)</div>
              </div>
            </div>
          </div>
        );

      case 's3':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Waves className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 03: Permanent Water Masking (JRC Global Surface Water)
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                JRC GSW v1.4
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Mask Status</span>
                <div className="flex items-center gap-1.5 font-bold mt-0.5">
                  {permanent_water_mask.applied ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                    </span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Unapplied
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Recurrence Threshold</span>
                <div className="font-mono font-extrabold text-ink mt-0.5 tabular-nums">
                  {permanent_water_mask.threshold ? `>= ${permanent_water_mask.threshold}%` : 'N/A'}
                </div>
              </div>
              <div className="col-span-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Scientific Note</span>
                <div className="font-sans text-xs text-stone-700 mt-0.5 truncate" title={permanent_water_mask.note || ''}>
                  {permanent_water_mask.note || 'None recorded'}
                </div>
              </div>
            </div>
          </div>
        );

      case 's4':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <GitFork className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 04: Dual Flood Segmentation (Custom U-Net vs. Otsu Baseline)
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Pixel-wise Classification
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Primary Model</span>
                <div className="font-sans font-extrabold text-sky-900 mt-0.5 truncate">
                  {model.name}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">U-Net Flood Extent</span>
                <div className="font-sans font-extrabold text-sky-900 mt-0.5 tabular-nums">
                  {summary.detected_flood_area_km2 ? `${summary.detected_flood_area_km2.toFixed(2)} km²` : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Conventional Baseline</span>
                <div className="font-sans font-extrabold text-indigo-900 mt-0.5 truncate">
                  {baseline.display_name}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Otsu Flood Extent</span>
                <div className="font-sans font-extrabold text-indigo-900 mt-0.5 tabular-nums">
                  {summary.baseline_flood_area_km2 ? `${summary.baseline_flood_area_km2.toFixed(2)} km²` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        );

      case 's5':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <Sprout className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 05: ESA WorldCover Agricultural Exposure Overlay
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Class 40 Cropland
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Mapped Cropland</span>
                <div className="font-sans font-extrabold text-ink mt-0.5 tabular-nums">
                  {summary.mapped_agricultural_area_km2 ? `${summary.mapped_agricultural_area_km2.toFixed(2)} km²` : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Exposed Cropland</span>
                <div className="font-sans font-extrabold text-amber-900 mt-0.5 tabular-nums">
                  {summary.potentially_exposed_agricultural_area_km2 ? `${summary.potentially_exposed_agricultural_area_km2.toFixed(2)} km²` : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Exposure Share</span>
                <div className="font-sans font-extrabold text-amber-900 mt-0.5 tabular-nums">
                  {summary.potentially_exposed_agricultural_share_percent ? `${summary.potentially_exposed_agricultural_share_percent.toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Classification Limit</span>
                <div className="font-sans text-xs text-stone-700 mt-0.5 truncate">
                  Land-cover; not Boro-specific
                </div>
              </div>
            </div>
          </div>
        );

      case 's6':
        return (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                  <FileText className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-ink">
                  Stage 06: Evidence-Grounded Multi-Lingual Reporting
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Bangla &bull; English
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Default Language</span>
                <div className="font-sans font-extrabold text-ink mt-0.5">বাংলা (Bangla)</div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Alternate Language</span>
                <div className="font-sans font-extrabold text-ink mt-0.5">English (en)</div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Generation Route</span>
                <div className="font-sans font-bold text-stone-800 mt-0.5">Deterministic Template</div>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                <span className="text-[10px] font-bold uppercase text-stone-500">Integrity Rule</span>
                <div className="font-sans text-xs text-stone-700 mt-0.5 truncate">
                  Zero hallucinated loss figures
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-haor-600">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Scientific Provenance & Traceability</span>
          </div>
          <h1 className="font-sans text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Methodology & Provenance
          </h1>
          <p className="mt-0.5 text-xs text-ink-muted">
            End-to-end processing pipeline, live analysis configurations, and complete data source ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200/90 bg-white px-2.5 text-xs font-semibold text-ink-muted shadow-2xs font-mono text-[11px]">
            API v1.0 &bull; EPSG:4326
          </div>
        </div>
      </div>

      {/* 1. Interactive Visual Pipeline Diagram */}
      <section aria-label="Interactive Processing Pipeline" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Interactive Processing Pipeline Architecture
          </h2>
          <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">
            Click any stage node to inspect live configuration parameters
          </span>
        </div>

        {/* 6-Node Horizontal Pipeline Flow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
          {steps.map((s, index) => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(s.id)}
                className={`relative flex flex-col justify-between text-left p-3.5 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'border-haor-600 bg-white shadow-md ring-2 ring-haor-200 scale-[1.02]'
                    : 'border-ink-border bg-white hover:bg-stone-50 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-haor-600">
                      {s.number}
                    </span>
                    <span className="text-stone-400">
                      {s.icon}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-ink leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">
                    {s.subtitle}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-stone-100">
                  {s.badge || <span />}
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-stone-300 hidden md:block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Stage Detail Bar */}
        <div className="rounded-xl border border-haor-200/90 bg-white p-4 shadow-xs">
          {renderActiveStepDetail()}
        </div>
      </section>

      {/* 2. Data Provenance Ledger */}
      <section aria-label="Data Provenance Ledger" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
            <Satellite className="h-4 w-4 text-haor-600" />
            <span>Data Provenance Ledger</span>
          </h2>
          <span className="text-[11px] font-semibold text-stone-500">
            {sourcesData.sources.length} Ingested Datasets
          </span>
        </div>

        {/* Responsive Table */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Geospatial Data Sources Ledger"
          className="overflow-x-auto rounded-xl border border-ink-border bg-white shadow-xs focus:outline-hidden focus:ring-2 focus:ring-haor-600"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-stone-50/95 border-b border-stone-200 text-ink-muted font-bold uppercase tracking-wider text-[11px] backdrop-blur-xs">
              <tr>
                <th scope="col" className="px-4 py-3">Dataset & Provider</th>
                <th scope="col" className="px-4 py-3">Pipeline Role</th>
                <th scope="col" className="px-4 py-3">Resolution & CRS</th>
                <th scope="col" className="px-4 py-3">Observation Period</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Notes & Caveats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sourcesData.sources.map((src) => {
                const statusBadge = {
                  used: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  reference_only: 'bg-sky-50 text-sky-800 border-sky-200',
                  unavailable: 'bg-stone-100 text-stone-600 border-stone-200',
                }[src.status];

                const periodText = formatDateRange(src.period_start, src.period_end);

                return (
                  <tr key={src.dataset_key} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-ink">
                      <div className="flex items-center gap-1.5">
                        <span>{src.display_name}</span>
                        {src.source_url && (
                          <a
                            href={src.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-haor-600 transition-colors"
                            title="Visit Source Provider"
                            aria-label={`Visit ${src.display_name} provider website`}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] font-normal text-stone-500">
                        {src.provider}
                        {src.version && (
                          <span className="font-mono text-[10px] text-stone-400 ml-1.5 bg-stone-100 px-1 py-0.2 rounded">
                            {src.version}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-stone-700 max-w-xs font-semibold">
                      {src.role}
                    </td>

                    <td className="px-4 py-3.5 text-stone-600 font-mono text-[11px] whitespace-nowrap tabular-nums">
                      {src.resolution_m ? `${src.resolution_m}m` : 'N/A'}
                      {src.crs && (
                        <span className="block text-[10px] text-stone-400">
                          {src.crs.split('/')[0].trim()}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-stone-600 tabular-nums whitespace-nowrap text-[11px]">
                      {src.acquired_at ? (
                        <span>{formatDate(src.acquired_at)}</span>
                      ) : src.period_start || src.period_end ? (
                        <span>{periodText}</span>
                      ) : (
                        <span className="text-stone-400 italic">Static Reference</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${statusBadge}`}
                      >
                        {src.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-stone-500 text-[11px] max-w-xs">
                      {src.notes || <span className="text-stone-300">&mdash;</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Scope & Caveats Guardrail Matrix */}
      <section aria-label="Scientific Scope and Guardrails" className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-haor-600" />
          <span>Scope & Caveats Guardrail Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Card 1: Observation vs Forecast */}
          <div className="rounded-xl border border-ink-border bg-white p-4 shadow-xs hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span>Observation vs. Forecast</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Provides retrospective Sentinel-1 SAR flood mapping based on past satellite overpasses.
              <strong> Does not</strong> predict future water levels or issue real-time emergency flash-flood alerts.
            </p>
          </div>

          {/* Card 2: Potential Exposure vs Crop Loss */}
          <div className="rounded-xl border border-ink-border bg-white p-4 shadow-xs hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Sprout className="h-3.5 w-3.5" />
              </div>
              <span>Exposure vs. Verified Loss</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              ESA WorldCover overlap calculates <strong>potential exposure</strong> of mapped cropland.
              It does not verify standing Boro paddy survival, yield loss, or financial damages.
            </p>
          </div>

          {/* Card 3: Radar & Revisit Limits */}
          <div className="rounded-xl border border-ink-border bg-white p-4 shadow-xs hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-2 text-ink font-bold text-xs uppercase tracking-wider mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-600 border border-stone-200">
                <Radio className="h-3.5 w-3.5" />
              </div>
              <span>Radar & Revisit Limits</span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Sentinel-1 C-band backscatter can experience rough-water surface scatter from strong winds.
              The 6-to-12 day satellite revisit frequency may miss short-lived flash flood peaks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
