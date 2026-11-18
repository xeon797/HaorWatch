import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Analysis',
  message = 'An unexpected error occurred while communicating with the HaorWatch API.',
  code,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 p-8 text-center sm:p-12">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {code && (
        <span className="mt-1 font-mono text-xs font-semibold text-red-700 bg-red-100/80 px-2 py-0.5 rounded">
          {code}
        </span>
      )}
      <p className="mt-2 max-w-md text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-stone-200 px-4 py-2 text-xs font-medium text-ink shadow-xs hover:bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-haor-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};
