import React from 'react';
import { ConfusionMatrix } from '../../types/api';

interface ConfusionMatrixCardProps {
  methodName: string;
  methodKey: string;
  accentColor: 'blue' | 'indigo';
  matrix: ConfusionMatrix;
  notes?: string | null;
}

export const ConfusionMatrixCard: React.FC<ConfusionMatrixCardProps> = ({
  methodName,
  methodKey,
  accentColor,
  matrix,
  notes,
}) => {
  const tp = matrix.true_positive ?? 0;
  const fp = matrix.false_positive ?? 0;
  const tn = matrix.true_negative ?? 0;
  const fn = matrix.false_negative ?? 0;

  const total = tp + fp + tn + fn;
  const actualFlood = tp + fn;
  const actualNonFlood = tn + fp;

  const formatPixels = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'Unavailable';
    return num.toLocaleString('en-US');
  };

  const calcShare = (num: number, denom: number) => {
    if (denom <= 0) return '0.0%';
    return `${((num / denom) * 100).toFixed(1)}%`;
  };

  const badgeDot = accentColor === 'blue' ? 'bg-[#0284C7]' : 'bg-[#6366F1]';
  const badgeBorder = accentColor === 'blue' ? 'border-sky-200 bg-sky-50 text-sky-900' : 'border-indigo-200 bg-indigo-50 text-indigo-900';

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-ink-border bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div>
        {/* Card Header: Spacious & Clear */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className={`h-3 w-3 rounded-full ${badgeDot}`} />
            <h3 className="font-sans text-base sm:text-lg font-black text-ink">{methodName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border ${badgeBorder}`}>
              {methodKey}
            </span>
            <span className="font-mono text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              positive: flood
            </span>
          </div>
        </div>

        {/* 2x2 Matrix with Spacious Layout */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-500">
            <span>Reference Ground Truth vs. Predicted Output</span>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cell 1: True Positive (TP) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  True Positive (TP)
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded tabular-nums">
                  {actualFlood > 0 ? calcShare(tp, actualFlood) : ''} of flood
                </span>
              </div>
              <div className="my-3 font-sans text-2xl sm:text-3xl font-black text-emerald-950 tabular-nums">
                {formatPixels(matrix.true_positive)}
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                Correctly detected flood pixels
              </p>
            </div>

            {/* Cell 2: False Negative (FN) */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  False Negative (FN)
                </span>
                <span className="font-mono text-xs font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded tabular-nums">
                  {actualFlood > 0 ? calcShare(fn, actualFlood) : ''} of flood
                </span>
              </div>
              <div className="my-3 font-sans text-2xl sm:text-3xl font-black text-rose-950 tabular-nums">
                {formatPixels(matrix.false_negative)}
              </div>
              <p className="text-xs text-rose-700 font-medium">
                Missed flood inundation (under-prediction)
              </p>
            </div>

            {/* Cell 3: False Positive (FP) */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  False Positive (FP)
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded tabular-nums">
                  {actualNonFlood > 0 ? calcShare(fp, actualNonFlood) : ''} of dry
                </span>
              </div>
              <div className="my-3 font-sans text-2xl sm:text-3xl font-black text-amber-950 tabular-nums">
                {formatPixels(matrix.false_positive)}
              </div>
              <p className="text-xs text-amber-800 font-medium">
                False water alarms (over-prediction)
              </p>
            </div>

            {/* Cell 4: True Negative (TN) */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  True Negative (TN)
                </span>
                <span className="font-mono text-xs font-bold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded tabular-nums">
                  {actualNonFlood > 0 ? calcShare(tn, actualNonFlood) : ''} of dry
                </span>
              </div>
              <div className="my-3 font-sans text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
                {formatPixels(matrix.true_negative)}
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Correctly classified dry / non-flood ground
              </p>
            </div>
          </div>
        </div>

        {notes && (
          <p className="mt-5 text-xs text-ink-muted leading-relaxed border-t border-stone-100 pt-3">
            {notes}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 tabular-nums">
        <span>Evaluated Pixels: <strong className="text-ink">{total > 0 ? total.toLocaleString() : 'N/A'}</strong></span>
        <span className="font-medium text-stone-400">Standardized holdout evaluation</span>
      </div>
    </div>
  );
};
