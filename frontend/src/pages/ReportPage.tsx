import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLatestAnalysis, useReport } from '../hooks/useHaorWatch';
import { ReportLanguage } from '../types/api';
import { formatDate, formatArea } from '../lib/formatters';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Copy,
  Check,
  ShieldAlert,
  Calendar,
  AlertCircle,
  FileText,
  Waves,
  Sprout,
  Sparkles,
  Printer,
  Compass,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const [language, setLanguage] = useState<ReportLanguage>('bn');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const { data: analysis, isLoading: isAnalysisLoading } = useLatestAnalysis('pilot-haor');
  const {
    data: report,
    isLoading: isReportLoading,
    error: reportError,
    refetch,
  } = useReport(analysis?.id, language);

  const handleCopy = async () => {
    if (!report) return;
    setCopyError(null);
    const textToCopy = `${report.title}\n\n${report.body}\n\nCaveats:\n${report.caveats.join('\n')}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setCopyError('Unable to access clipboard automatically. Please select text manually.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Editorial Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-haor-600 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-md">
              <FileText className="h-3 w-3" />
              <span>Automated Satellite Briefing</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              <Compass className="h-3 w-3 text-stone-400" />
              <span>Hakaluki Haor Catchment</span>
            </span>
          </div>

          <h1 className="font-sans text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Situation Briefing Report
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Ground-referenced Copernicus Sentinel-1 observation dossier for agricultural, water management & disaster response stakeholders
          </p>
        </div>

        {/* Action Controls Group: Sized h-9 and evenly spaced */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Segmented Language Switcher (h-9) */}
          <div
            role="group"
            aria-label="Language selection"
            className="flex h-9 items-center rounded-lg border border-stone-200/90 bg-stone-100/90 p-0.5 shadow-2xs gap-0.5"
          >
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`h-7.5 px-3.5 flex items-center justify-center rounded-md text-xs font-bold transition-all duration-200 ${
                language === 'bn'
                  ? 'bg-white text-ink shadow-xs border border-stone-200/70'
                  : 'text-stone-500 hover:text-ink hover:bg-white/50'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`h-7.5 px-3.5 flex items-center justify-center rounded-md text-xs font-bold transition-all duration-200 ${
                language === 'en'
                  ? 'bg-white text-ink shadow-xs border border-stone-200/70'
                  : 'text-stone-500 hover:text-ink hover:bg-white/50'
              }`}
            >
              English
            </button>
          </div>

          {/* Copy Button (h-9) */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!report || isReportLoading}
            className="h-9 flex items-center gap-1.5 rounded-lg border border-stone-200/90 bg-white px-3 text-xs font-bold text-ink shadow-2xs hover:bg-stone-50 hover:border-stone-300 disabled:opacity-50 transition-all duration-200"
            title="Copy briefing to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-stone-500 shrink-0" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Print / Save PDF Button (h-9) */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={!report || isReportLoading}
            className="h-9 flex items-center gap-1.5 rounded-lg border border-stone-200/90 bg-white px-3 text-xs font-bold text-ink shadow-2xs hover:bg-stone-50 hover:border-stone-300 disabled:opacity-50 transition-all duration-200"
            title="Print or export as PDF"
          >
            <Printer className="h-3.5 w-3.5 text-stone-500 shrink-0" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* Map Explorer Deep Link (h-9) */}
          <Link
            to="/map"
            className="h-9 flex items-center gap-1.5 rounded-lg bg-haor-600 px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-haor-700 transition-all duration-200"
          >
            <span>Explore Map</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>
      </div>

      {copyError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{copyError}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {(isAnalysisLoading || isReportLoading) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4 rounded-2xl border border-ink-border bg-white p-6 sm:p-8 shadow-xs animate-pulse">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2.5 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-28 w-full rounded-xl mt-6" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {reportError && (
        <ErrorState
          title="Unable to Load Report"
          message={(reportError as Error).message}
          onRetry={() => refetch()}
        />
      )}

      {/* Main 12-Column Balanced Proportional Layout */}
      {!isReportLoading && report && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): The Main Situation Dossier */}
          <section className="lg:col-span-8 space-y-5">
            <article className="carto-corners overflow-hidden rounded-2xl border border-ink-border bg-white shadow-xs">
              
              {/* Top Cartographic Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 bg-stone-50/70 px-6 sm:px-8 py-3.5 text-xs text-ink-muted">
                <div className="flex items-center gap-2 tabular-nums">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  <span>Observation: <strong>{formatDate(report.data_as_of || report.created_at)}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded bg-stone-200/70 px-2 py-0.5 font-mono text-[11px] text-stone-700 font-semibold">
                    <Sparkles className="h-3 w-3 text-teal-600" />
                    <span>{report.generation_method === 'template' ? 'Deterministic Engine' : 'AI-Assisted Synthesis'}</span>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="font-mono text-[11px] text-stone-500 font-bold uppercase">{report.language}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="p-6 sm:p-8 sm:py-9">
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight text-ink ${
                    language === 'bn' ? 'font-bangla leading-normal text-2xl sm:text-3xl font-extrabold' : 'font-sans'
                  }`}
                >
                  {report.title}
                </h2>

                <div
                  className={`mt-6 space-y-4 text-stone-700 leading-relaxed ${
                    language === 'bn'
                      ? 'font-bangla text-base sm:text-lg leading-relaxed'
                      : 'font-sans text-sm sm:text-base leading-relaxed'
                  }`}
                >
                  {report.body}
                </div>
              </div>

              {/* Explicit Methodology & Domain Caveats Section */}
              <div className="border-t border-amber-200/80 bg-amber-50/60 p-6 sm:p-7">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-lg bg-amber-100 p-1.5 text-amber-800 shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                      <span>Methodological Limitations & Operational Caveats</span>
                      <span className="rounded bg-amber-200/80 px-1.5 py-0.2 font-mono text-[10px] text-amber-900 font-bold">
                        Mandatory Notice
                      </span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-amber-950/85">
                      {report.caveats.map((caveat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-0.5">&bull;</span>
                          <span className={language === 'bn' ? 'font-bangla text-sm' : ''}>
                            {caveat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </article>

            {/* Verification Protocol Notice Bar */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-600 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-ink">Field Action Protocol:</span> In accordance with Bangladesh Agricultural Research Council (BARC) guidelines, remote sensing delineations indicate <em>potential exposure</em> and require field validation by Upazila Agricultural Extension Officers before relief allocations or claim settlements.
              </div>
            </div>
          </section>

          {/* Right Column (4 cols): Quantitative Findings, Telemetry Dossier & Action Tools */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* 1. Quantitative Impact Metrics Card */}
            <div className="rounded-2xl border border-ink-border bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Waves className="h-4 w-4" />
                  </div>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                    Quantitative Findings
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-stone-400">EPSG:4326</span>
              </div>

              <div className="space-y-3.5">
                {/* Detected Flood Area */}
                <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-medium">Detected Flood Extent</span>
                    <span className="inline-flex items-center gap-1 rounded bg-sky-100/70 px-1.5 py-0.2 font-mono text-[10px] font-bold text-sky-800">
                      U-Net ML
                    </span>
                  </div>
                  <div className="font-sans text-xl font-black text-ink tabular-nums">
                    {formatArea(analysis.summary.detected_flood_area_km2)}
                  </div>
                  <div className="mt-1 text-[11px] text-stone-500">
                    Baseline comparison: <span className="font-semibold text-stone-700 tabular-nums">{formatArea(analysis.summary.baseline_flood_area_km2)}</span> (Otsu)
                  </div>
                </div>

                {/* Potentially Exposed Cropland */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                  <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
                    <span className="font-medium flex items-center gap-1">
                      <Sprout className="h-3.5 w-3.5 text-amber-600" />
                      <span>Potential Cropland</span>
                    </span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-amber-800">
                      ESA 2021
                    </span>
                  </div>
                  <div className="font-sans text-xl font-black text-amber-950 tabular-nums">
                    {formatArea(analysis.summary.potentially_exposed_agricultural_area_km2)}
                  </div>
                  <div className="mt-1 text-[11px] text-amber-900/80">
                    Intersection with active seasonal Boro paddy crop envelope
                  </div>
                </div>

                {/* Permanent Water Mask */}
                <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-medium">Permanent Water Excluded</span>
                    <span className="inline-flex items-center gap-1 rounded bg-blue-100/70 px-1.5 py-0.2 font-mono text-[10px] font-bold text-blue-800">
                      JRC GSW
                    </span>
                  </div>
                  <div className="font-sans text-base font-bold text-ink tabular-nums flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                    <span>{analysis.permanent_water_mask.applied ? 'Applied (Excluded)' : 'Unapplied'}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-stone-500">
                    Recurrence threshold: <span className="font-semibold text-stone-700 tabular-nums">{analysis.permanent_water_mask.threshold ?? 80}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Sensor & Radar Acquisition Dossier Card */}
            <div className="rounded-2xl border border-ink-border bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-haor-600">
                    <Radio className="h-4 w-4" />
                  </div>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                    Radar Acquisition Dossier
                  </h3>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-haor-600" />
                </span>
              </div>

              <dl className="divide-y divide-stone-100 text-xs">
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500 font-medium">Platform</dt>
                  <dd className="font-mono font-semibold text-ink">Sentinel-1A (ESA)</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500 font-medium">Instrument Mode</dt>
                  <dd className="font-mono text-stone-700">IW (Interferometric Wide)</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500 font-medium">Polarization</dt>
                  <dd className="font-mono text-stone-700">Dual VV + VH</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500 font-medium">Spatial Resolution</dt>
                  <dd className="font-mono text-stone-700 tabular-nums">10m Ground Pixel</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-stone-500 font-medium">Target Basin</dt>
                  <dd className="font-semibold text-stone-800">Hakaluki Haor, Sylhet</dd>
                </div>
              </dl>
            </div>

            {/* 3. Operational Quick Action Card */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                Operational Dispatch Links
              </h4>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Inspect vector polygons, toggle optical imagery, and run cross-sectional analysis in the full map explorer.
              </p>
              
              <Link
                to="/map"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-stone-200 py-2.5 px-4 text-xs font-bold text-ink shadow-2xs hover:border-haor-500 hover:text-haor-700 transition-all duration-200"
              >
                <span>Launch Interactive Map</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Synchronized with latest satellite pass</span>
              </div>
            </div>

          </aside>

        </div>
      )}
    </div>
  );
};
