import React from 'react';
import { useLatestAnalysis, useStudyAreaDetail } from '../hooks/useHaorWatch';
import { MiniOverviewMap } from '../components/map/MiniOverviewMap';
import { KpiCard } from '../components/ui/KpiCard';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { BanglaBriefingStrip } from '../components/overview/BanglaBriefingStrip';
import {
  formatArea,
  formatPercent,
  formatAreaDelta,
  formatValidationStatus,
  formatDateRange,
} from '../lib/formatters';
import {
  Waves,
  MapPin,
  CheckCircle2,
  Cpu,
  Sprout,
  ShieldCheck,
  Calendar,
  Satellite,
  Layers,
} from 'lucide-react';
import { ApiError } from '../lib/api-client';

export const OverviewPage: React.FC = () => {
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
    refetch: refetchAnalysis,
  } = useLatestAnalysis('pilot-haor');

  const { data: studyArea } = useStudyAreaDetail('pilot-haor');

  // Loading Skeleton State
  if (isAnalysisLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* 60/40 Hero Split Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <Skeleton className="h-[440px] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Skeleton className="h-[96px] w-full rounded-xl" />
            <Skeleton className="h-[96px] w-full rounded-xl" />
            <Skeleton className="h-[96px] w-full rounded-xl" />
            <Skeleton className="h-[96px] w-full rounded-xl" />
          </div>
        </div>

        {/* Briefing Strip Skeleton */}
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  // 404 ANALYSIS_NOT_FOUND Empty State
  if (
    analysisError instanceof ApiError &&
    (analysisError.code === 'ANALYSIS_NOT_FOUND' || analysisError.status === 404)
  ) {
    return (
      <EmptyState
        title="No Analysis Available"
        description="No flood analysis run has been recorded for this study area yet. Once satellite imagery is ingested and processed, the latest observation will appear here."
        actionLabel="Check for New Analyses"
        onAction={() => refetchAnalysis()}
      />
    );
  }

  // Generic Error State
  if (analysisError || !analysis) {
    return (
      <ErrorState
        title="Unable to Retrieve Overview Analysis"
        message={analysisError ? (analysisError as Error).message : 'Analysis data is currently unavailable.'}
        onRetry={() => refetchAnalysis()}
      />
    );
  }

  const { summary, validation, model, permanent_water_mask } = analysis;
  const deltaInfo = formatAreaDelta(summary.detected_flood_area_km2, summary.baseline_flood_area_km2);
  const valStatus = formatValidationStatus(validation?.status);
  const bounds = studyArea?.bounds || [91.98, 24.60, 92.12, 24.74];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Prominent Hero Header with Project Logo */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-2xl border border-ink-border bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Official Project Logo */}
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-50 to-teal-50/40 border border-stone-200/90 p-2 shadow-sm hover:scale-105 hover:rotate-1 transition-all duration-300">
            <img
              src="/logo.png"
              alt="HaorWatch AI Official Project Logo"
              className="h-full w-full object-contain"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-haor-600 uppercase tracking-wider bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-md">
                <MapPin className="h-3 w-3" />
                <span>Pilot Study Catchment &bull; Sylhet Basin</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                <Satellite className="h-3 w-3 text-stone-400" />
                <span>Sentinel-1 C-SAR</span>
              </span>
            </div>

            <h1 className="mt-1 font-sans text-2xl font-black tracking-tight text-ink sm:text-3xl">
              {analysis.study_area.name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span className="flex items-center gap-1 tabular-nums font-semibold text-stone-700">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                {formatDateRange(analysis.observation_start, analysis.observation_end)}
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-stone-500">
                Area: <strong className="text-stone-700 tabular-nums">{formatArea(summary.study_area_km2)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Live Model & Mask Status Pills (Strictly even height) */}
        <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2">
          <div
            className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-semibold text-ink-muted shadow-2xs"
            title={`Primary ML Model: ${model.name}`}
          >
            <Cpu className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span className="text-ink font-bold">U-Net</span>
            <span className="text-stone-300">|</span>
            <span className="font-mono text-[11px] text-stone-500">{model.version || 'v0.1.0'}</span>
          </div>

          <div
            className="flex h-8 items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-semibold text-ink-muted shadow-2xs"
            title={permanent_water_mask.note || 'Permanent water recurrence mask'}
          >
            <Waves className="h-3.5 w-3.5 text-haor-600 shrink-0" />
            <span className="text-ink font-bold">JRC Mask</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500">{permanent_water_mask.applied ? 'Applied' : 'Unapplied'}</span>
          </div>
        </div>
      </section>

      {/* Asymmetric 60/40 Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left (60%): Interactive Leaflet Mini-Map Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <MiniOverviewMap analysisId={analysis.id} bounds={bounds} />
        </div>

        {/* Right (40%): 4 Breathable KPI Cards with Slick Icons */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4">
          
          {/* 1. Detected Flood Extent */}
          <KpiCard
            label="Detected Flood Extent"
            value={formatArea(summary.detected_flood_area_km2).replace(' km²', '')}
            unit="km²"
            accentBorder="teal"
            icon={<Waves className="h-3.5 w-3.5" />}
            iconBg="blue"
            hint="Classified flood pixels from custom U-Net model on Sentinel-1 SAR after permanent water masking."
            badge={
              <Badge
                variant={deltaInfo.sign === 'positive' ? 'teal' : 'neutral'}
                className="font-mono text-[11px]"
              >
                {deltaInfo.deltaFormatted}
              </Badge>
            }
            footnote={
              <span>
                Baseline: <strong>{formatArea(summary.baseline_flood_area_km2)}</strong>
              </span>
            }
          />

          {/* 2. Potentially Exposed Agricultural Area */}
          <KpiCard
            label="Potentially Exposed Agricultural Land"
            value={formatArea(summary.potentially_exposed_agricultural_area_km2).replace(' km²', '')}
            unit="km²"
            accentBorder="amber"
            icon={<Sprout className="h-3.5 w-3.5" />}
            iconBg="amber"
            hint="Spatial intersection of detected flood extent and ESA WorldCover agricultural classes. Does not indicate verified crop loss or yield damage."
            badge={
              <Badge variant="warning" className="font-mono text-[11px]">
                {formatPercent(summary.potentially_exposed_agricultural_share_percent)} of flood
              </Badge>
            }
            footnote={
              <span className="text-amber-800 font-semibold text-[11px]">
                Potential exposure &bull; Not crop damage
              </span>
            }
          />

          {/* 3. Mapped Agricultural Area */}
          <KpiCard
            label="Mapped Agricultural Land"
            value={formatArea(summary.mapped_agricultural_area_km2).replace(' km²', '')}
            unit="km²"
            accentBorder="none"
            icon={<Layers className="h-3.5 w-3.5" />}
            iconBg="neutral"
            hint="Total mapped cropland within the catchment boundary according to ESA WorldCover 10m."
            badge={
              <Badge variant="neutral" className="text-[11px]">
                ESA WorldCover
              </Badge>
            }
            footnote={
              <span>
                Total AOI: <strong>{formatArea(summary.study_area_km2)}</strong>
              </span>
            }
          />

          {/* 4. Validation Status */}
          <div className="rounded-xl border border-ink-border bg-white p-4.5 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-600 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Validation Status
                </span>
              </div>
              <CheckCircle2 className="h-4 w-4 text-stone-400" />
            </div>

            <div className="mt-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${valStatus.badgeClass}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span>{valStatus.label}</span>
              </span>
            </div>

            <p className="mt-2 text-[11px] text-stone-500 leading-snug line-clamp-1">
              {validation.note || valStatus.description}
            </p>
          </div>

        </div>

      </section>

      {/* Bottom Compact Bangla Briefing Strip */}
      <BanglaBriefingStrip analysisId={analysis.id} />

    </div>
  );
};
