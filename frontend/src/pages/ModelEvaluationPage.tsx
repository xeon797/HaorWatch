import React from 'react';
import { useLatestAnalysis, useEvaluationMetrics } from '../hooks/useHaorWatch';
import { formatValidationStatus, formatDate } from '../lib/formatters';
import { ScoreBarComparison } from '../components/evaluation/ScoreBarComparison';
import { ConfusionMatrixCard } from '../components/evaluation/ConfusionMatrixCard';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Cpu,
  Database,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Layers,
  Activity,
  Target,
  Crosshair,
  Compass,
  Radio,
} from 'lucide-react';

export const ModelEvaluationPage: React.FC = () => {
  const { data: analysis, isLoading: isAnalysisLoading } = useLatestAnalysis('pilot-haor');
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    error: metricsError,
    refetch,
  } = useEvaluationMetrics(analysis?.id);

  if (isAnalysisLoading || isMetricsLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (metricsError) {
    return (
      <ErrorState
        title="Unable to Load Evaluation Metrics"
        message={(metricsError as Error).message}
        onRetry={() => refetch()}
      />
    );
  }

  // Graceful Empty/Null State: No evaluation calculated or empty methods
  const isEvaluationUnavailable =
    !metrics ||
    metrics.validation_status === 'not_available' ||
    !metrics.methods ||
    metrics.methods.length === 0;

  if (isEvaluationUnavailable) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-stone-200 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-haor-600">
            Model Accountability
          </span>
          <h1 className="font-sans text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Model Evaluation
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            Independent benchmark assessment on held-out evaluation chips
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 mb-4">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-ink">Evaluation Not Available</h3>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            No held-out benchmark evaluation metrics were calculated or recorded for this analysis run.
            To maintain strict scientific integrity, placeholder scores or zeros are never displayed.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-semibold text-stone-700">
            <AlertCircle className="h-4 w-4 text-stone-400" />
            <span>Validation status: <strong>not_available</strong></span>
          </div>
        </div>
      </div>
    );
  }

  const valStatus = formatValidationStatus(metrics.validation_status);

  // Extract ML and Baseline methods
  const mlMethod =
    metrics.methods.find((m) => m.method_key === 'custom_ml') || metrics.methods[0];
  const baselineMethod =
    metrics.methods.find((m) => m.method_key === 'otsu_baseline') || metrics.methods[1];

  const evaluatedAtDate = mlMethod?.evaluated_at || baselineMethod?.evaluated_at;

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in">
      {/* Top Editorial Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-haor-600 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-md mb-1.5 w-fit">
            <Cpu className="h-3 w-3" />
            <span>Model Accountability & Benchmarking</span>
          </div>
          <h1 className="font-sans text-2xl font-black tracking-tight text-ink sm:text-3xl">
            Model Evaluation
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            Independent held-out benchmark: Custom U-Net semantic segmentation vs. conventional Otsu SAR baseline
          </p>
        </div>

        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold shadow-2xs ${valStatus.badgeClass}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>{valStatus.label}</span>
          </span>
        </div>
      </div>

      {/* 1. Top Audit Header Card (Airy, Spacious) */}
      <section
        aria-label="Benchmark Dataset Audit"
        className="rounded-2xl border border-ink-border bg-white p-6 sm:p-7 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-haor-600 border border-teal-100">
                <Database className="h-4 w-4" />
              </div>
              <h2 className="font-bold text-base text-ink">
                Benchmark: {metrics.test_dataset.name}
              </h2>
              {metrics.test_dataset.version && (
                <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {metrics.test_dataset.version}
                </span>
              )}
            </div>

            <p className="text-xs text-ink-muted pl-10.5">
              Holdout Split Strategy:{' '}
              <strong className="text-stone-800">
                {metrics.test_dataset.split_strategy || 'Geographic Holdout'}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100">
            <div className="flex h-9 items-center gap-2 tabular-nums bg-stone-50 border border-stone-200/90 rounded-xl px-3 font-semibold shadow-2xs">
              <span className="text-stone-500">Test Pixels:</span>
              <strong className="text-ink">
                {metrics.test_dataset.test_pixel_count
                  ? metrics.test_dataset.test_pixel_count.toLocaleString('en-US')
                  : 'N/A'}
              </strong>
            </div>

            {evaluatedAtDate && (
              <div className="flex h-9 items-center gap-2 tabular-nums bg-stone-50 border border-stone-200/90 rounded-xl px-3 font-semibold shadow-2xs">
                <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>{formatDate(evaluatedAtDate)}</span>
              </div>
            )}

            <div className="flex h-9 items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 text-sky-900 font-mono text-xs font-bold shadow-2xs">
              <span>positive: <strong>{metrics.positive_class}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Metric Comparison (Airy & Spacious) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Comparative Metric Performance (0.000 – 1.000 Scale)
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Side-by-side performance on identical held-out test chips and valid-pixel masks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* IoU */}
          <ScoreBarComparison
            label="Intersection over Union (IoU)"
            description="Area of overlap between predicted and reference flood divided by union"
            mlScore={mlMethod?.iou}
            baselineScore={baselineMethod?.iou}
            mlMethodName={mlMethod?.method_name}
            baselineMethodName={baselineMethod?.method_name}
            icon={<Layers className="h-4 w-4 text-sky-600" />}
          />

          {/* F1 Score */}
          <ScoreBarComparison
            label="F1 Score (Dice Coefficient)"
            description="Harmonic mean balancing missed flood detections against false alarms"
            mlScore={mlMethod?.f1}
            baselineScore={baselineMethod?.f1}
            mlMethodName={mlMethod?.method_name}
            baselineMethodName={baselineMethod?.method_name}
            icon={<Activity className="h-4 w-4 text-teal-600" />}
          />

          {/* Precision */}
          <ScoreBarComparison
            label="Precision (True Detection Rate)"
            description="Proportion of predicted flood pixels that were genuinely flooded"
            mlScore={mlMethod?.precision}
            baselineScore={baselineMethod?.precision}
            mlMethodName={mlMethod?.method_name}
            baselineMethodName={baselineMethod?.method_name}
            icon={<Target className="h-4 w-4 text-indigo-600" />}
          />

          {/* Recall */}
          <ScoreBarComparison
            label="Recall (Sensitivity)"
            description="Proportion of actual reference flood pixels successfully classified"
            mlScore={mlMethod?.recall}
            baselineScore={baselineMethod?.recall}
            mlMethodName={mlMethod?.method_name}
            baselineMethodName={baselineMethod?.method_name}
            icon={<Crosshair className="h-4 w-4 text-amber-600" />}
          />
        </div>
      </section>

      {/* 3. 2×2 Confusion Matrices (Airy, Spacious, Clear) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Pixel-Level Classification Breakdown (2×2 Matrices)
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Full pixel distribution across True Positive, False Negative, False Positive, and True Negative classes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mlMethod && (
            <ConfusionMatrixCard
              methodName={mlMethod.method_name}
              methodKey={mlMethod.method_key}
              accentColor="blue"
              matrix={mlMethod.confusion_matrix}
              notes={mlMethod.notes}
            />
          )}

          {baselineMethod && (
            <ConfusionMatrixCard
              methodName={baselineMethod.method_name}
              methodKey={baselineMethod.method_key}
              accentColor="indigo"
              matrix={baselineMethod.confusion_matrix}
              notes={baselineMethod.notes}
            />
          )}
        </div>
      </section>

      {/* 4. Scientific Limitations Cards (Spacious, Roomy) */}
      <section
        aria-label="Documented Evaluation Limitations"
        className="rounded-2xl border border-ink-border bg-white p-6 sm:p-7 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
          <ShieldCheck className="h-5 w-5 text-haor-600 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Documented Scientific Limitations & Caveats
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col justify-between rounded-xl border border-stone-200/80 bg-stone-50/70 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-haor-600 border border-teal-100">
                <Compass className="h-4 w-4" />
              </div>
              <strong className="text-sm font-bold text-ink">Global Holdout</strong>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Sen1Floods11 labels cover global flood events; local wetland vegetation and floating macrophytes in Sylhet require localized auditing.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-stone-200/80 bg-stone-50/70 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <Radio className="h-4 w-4" />
              </div>
              <strong className="text-sm font-bold text-ink">Radar Roughness</strong>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Strong seasonal monsoon winds cause water surface chop, increasing radar backscatter and complicating open-water classification.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-stone-200/80 bg-stone-50/70 p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Target className="h-4 w-4" />
              </div>
              <strong className="text-sm font-bold text-ink">Benchmark Integrity</strong>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Test chip scores demonstrate comparative model quality on public data, but do not replace certified ground surveys in Hakaluki Haor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
