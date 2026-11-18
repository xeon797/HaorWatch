import React from 'react';
import { Info } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  badge?: React.ReactNode;
  hint?: string;
  footnote?: React.ReactNode;
  accentBorder?: 'teal' | 'amber' | 'blue' | 'indigo' | 'none';
  icon?: React.ReactNode;
  iconBg?: 'blue' | 'amber' | 'teal' | 'neutral' | 'emerald';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  badge,
  hint,
  footnote,
  accentBorder = 'none',
  icon,
  iconBg = 'neutral',
}) => {
  const borderHighlight = {
    teal: 'border-l-4 border-l-haor-600',
    amber: 'border-l-4 border-l-amber-500',
    blue: 'border-l-4 border-l-sky-600',
    indigo: 'border-l-4 border-l-indigo-500',
    none: '',
  }[accentBorder];

  const iconStyles = {
    blue: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    teal: 'bg-teal-50 text-haor-600 border-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    neutral: 'bg-stone-50 text-stone-600 border-stone-200',
  }[iconBg];

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border border-ink-border bg-white p-4.5 sm:p-5 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover ${borderHighlight}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs shadow-2xs ${iconStyles}`}
              >
                {icon}
              </div>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {label}
            </span>
          </div>

          {hint && (
            <span
              title={hint}
              className="cursor-help text-stone-400 hover:text-ink transition-colors p-1"
              aria-label={hint}
            >
              <Info className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-ink tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-ink-muted">
              {unit}
            </span>
          )}
        </div>
      </div>

      {(badge || footnote) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100">
          {badge && <div className="shrink-0">{badge}</div>}
          {footnote && (
            <div className="text-[11px] font-medium text-ink-muted tabular-nums leading-tight">
              {footnote}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
