import React from 'react';
import { formatScore } from '../../lib/formatters';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ScoreBarComparisonProps {
  label: string;
  description?: string;
  mlScore: number | null | undefined;
  baselineScore: number | null | undefined;
  mlMethodName?: string;
  baselineMethodName?: string;
  icon?: React.ReactNode;
}

export const ScoreBarComparison: React.FC<ScoreBarComparisonProps> = ({
  label,
  description,
  mlScore,
  baselineScore,
  mlMethodName = 'Custom U-Net',
  baselineMethodName = 'Otsu Baseline',
  icon,
}) => {
  const mlVal = mlScore !== null && mlScore !== undefined ? mlScore : null;
  const baselineVal = baselineScore !== null && baselineScore !== undefined ? baselineScore : null;

  // Calculate delta
  let deltaText = 'No comparison';
  let deltaSign: 'positive' | 'negative' | 'neutral' | 'unknown' = 'unknown';

  if (mlVal !== null && baselineVal !== null) {
    const delta = mlVal - baselineVal;
    if (Math.abs(delta) < 0.001) {
      deltaText = 'Parity with baseline';
      deltaSign = 'neutral';
    } else if (delta > 0) {
      const pctGain = ((delta / baselineVal) * 100).toFixed(1);
      deltaText = `+${delta.toFixed(3)} (+${pctGain}%)`;
      deltaSign = 'positive';
    } else {
      const pctLoss = ((Math.abs(delta) / baselineVal) * 100).toFixed(1);
      deltaText = `${delta.toFixed(3)} (-${pctLoss}%)`;
      deltaSign = 'negative';
    }
  }

  const mlWidth = mlVal !== null ? Math.min(100, Math.max(0, mlVal * 100)) : 0;
  const baselineWidth = baselineVal !== null ? Math.min(100, Math.max(0, baselineVal * 100)) : 0;

  return (
    <div className="rounded-2xl border border-ink-border bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover flex flex-col justify-between">
      <div>
        {/* Header with Title & Delta Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/90 bg-stone-50 text-stone-600 shadow-2xs shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink">{label}</h4>
              {description && (
                <p className="text-xs text-ink-muted leading-normal mt-0.5">{description}</p>
              )}
            </div>
          </div>

          {/* Delta Pill */}
          {deltaSign !== 'unknown' && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums shrink-0 border shadow-2xs ${
                deltaSign === 'positive'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : deltaSign === 'negative'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {deltaSign === 'positive' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />}
              {deltaSign === 'negative' && <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />}
              {deltaSign === 'neutral' && <Minus className="h-3 w-3 text-stone-500" />}
              <span>{deltaText}</span>
            </div>
          )}
        </div>

        {/* Visual Progress Tracks (Roomy and spacious) */}
        <div className="mt-5 space-y-4">
          {/* 1. Custom U-Net Score Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-bold text-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7]" />
                <span className="text-xs">{mlMethodName}</span>
              </span>
              <span className="font-sans font-black text-base text-sky-900 tabular-nums">
                {formatScore(mlVal)}
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200/80">
              {mlVal !== null ? (
                <div
                  className="h-full rounded-full bg-[#0284C7] transition-all duration-700 ease-out"
                  style={{ width: `${mlWidth}%` }}
                  role="progressbar"
                  aria-valuenow={mlWidth}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${mlMethodName} ${label}`}
                />
              ) : (
                <div className="h-full w-full border border-dashed border-stone-300 text-[10px] text-stone-400 flex items-center justify-center">
                  Unavailable
                </div>
              )}
            </div>
          </div>

          {/* 2. Otsu Baseline Score Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-bold text-ink-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6366F1]" />
                <span className="text-xs">{baselineMethodName}</span>
              </span>
              <span className="font-sans font-black text-base text-indigo-900 tabular-nums">
                {formatScore(baselineVal)}
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200/80">
              {baselineVal !== null ? (
                <div
                  className="h-full rounded-full bg-[#6366F1] transition-all duration-700 ease-out"
                  style={{ width: `${baselineWidth}%` }}
                  role="progressbar"
                  aria-valuenow={baselineWidth}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${baselineMethodName} ${label}`}
                />
              ) : (
                <div className="h-full w-full border border-dashed border-stone-300 text-[10px] text-stone-400 flex items-center justify-center">
                  Unavailable
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
