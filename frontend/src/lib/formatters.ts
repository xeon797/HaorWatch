import type { ValidationStatusCode } from '../types/api';

/**
 * Formats a square kilometer area metric strictly adhering to domain rules:
 * - null => "Unavailable" (NEVER 0)
 * - 0 => "0.00 km²"
 * - positive => formatted to 2 decimal places with tabular grouping
 */
export function formatArea(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Unavailable';
  }
  return `${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} km²`;
}

/**
 * Formats a percentage metric:
 * - null => "Unavailable"
 * - 0 => "0.0%"
 * - positive => formatted with 1 decimal place
 */
export function formatPercent(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Unavailable';
  }
  return `${val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/**
 * Formats evaluation scores (IoU, F1, Precision, Recall):
 * - null => "Unavailable"
 * - 0 => "0.000"
 */
export function formatScore(val: number | null | undefined, decimals = 3): string {
  if (val === null || val === undefined || isNaN(val)) {
    return 'Unavailable';
  }
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats an ISO-8601 UTC timestamp to a human-readable UTC date:
 * e.g., "13 May 2026 UTC"
 */
export function formatDate(isoStr: string | null | undefined): string {
  if (!isoStr) return 'Unavailable';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return 'Unavailable';
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year} UTC`;
  } catch {
    return 'Unavailable';
  }
}

/**
 * Formats observation start & end dates cleanly in UTC.
 * e.g., "01 May – 13 May 2026 UTC"
 */
export function formatDateRange(
  startStr: string | null | undefined,
  endStr: string | null | undefined
): string {
  if (!startStr && !endStr) return 'Date range unavailable';
  if (startStr && !endStr) return `From ${formatDate(startStr)}`;
  if (!startStr && endStr) return `Until ${formatDate(endStr)}`;

  try {
    const s = new Date(startStr!);
    const e = new Date(endStr!);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Date range unavailable';

    const sDay = String(s.getUTCDate()).padStart(2, '0');
    const eDay = String(e.getUTCDate()).padStart(2, '0');
    const sMonth = s.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const eMonth = e.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const sYear = s.getUTCFullYear();
    const eYear = e.getUTCFullYear();

    if (sYear === eYear && sMonth === eMonth) {
      return `${sDay} – ${eDay} ${sMonth} ${sYear} UTC`;
    }
    if (sYear === eYear) {
      return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear} UTC`;
    }
    return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear} UTC`;
  } catch {
    return 'Date range unavailable';
  }
}

/**
 * Formats validation status codes into honest, user-friendly labels.
 */
export function formatValidationStatus(status: ValidationStatusCode | string | null | undefined): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (status) {
    case 'external_reference_checked':
      return {
        label: 'External Reference Checked',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        description: 'Cross-validated against an independent date-matched reference map.',
      };
    case 'internal_test_only':
      return {
        label: 'Internal Test Only',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        description: 'Evaluated on held-out test splits. No external ground-truth validation.',
      };
    case 'not_available':
    default:
      return {
        label: 'External Validation Unavailable',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        description: 'No verified ground truth or independent reference map available for this run.',
      };
  }
}

/**
 * Formats an area delta between ML and baseline flood extent.
 */
export function formatAreaDelta(
  mlArea: number | null | undefined,
  baselineArea: number | null | undefined
): { deltaFormatted: string; sign: 'positive' | 'negative' | 'neutral' | 'unknown' } {
  if (mlArea === null || mlArea === undefined || baselineArea === null || baselineArea === undefined) {
    return { deltaFormatted: 'No baseline comparison', sign: 'unknown' };
  }
  const delta = mlArea - baselineArea;
  const absDelta = Math.abs(delta).toFixed(2);
  if (Math.abs(delta) < 0.01) {
    return { deltaFormatted: 'Matches baseline', sign: 'neutral' };
  }
  if (delta > 0) {
    return { deltaFormatted: `+${absDelta} km² vs baseline`, sign: 'positive' };
  }
  return { deltaFormatted: `-${absDelta} km² vs baseline`, sign: 'negative' };
}
