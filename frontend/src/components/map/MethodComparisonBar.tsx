import React from 'react';
import { GitCompare, X } from 'lucide-react';

interface MethodComparisonBarProps {
  isCompareMode: boolean;
  onToggleCompare: () => void;
  canCompare: boolean;
}

export const MethodComparisonBar: React.FC<MethodComparisonBarProps> = ({
  isCompareMode,
  onToggleCompare,
  canCompare,
}) => {
  return (
    <button
      type="button"
      disabled={!canCompare}
      onClick={onToggleCompare}
      className={`h-9 flex items-center gap-2 rounded-lg border px-3 text-xs font-bold shadow-xs transition-all duration-200 ${
        isCompareMode
          ? 'border-indigo-400 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200 shadow-sm'
          : 'border-ink-border bg-white text-ink hover:bg-stone-50 hover:border-indigo-300'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={
        canCompare
          ? 'Toggle split-curtain comparison between U-Net ML and Otsu Baseline'
          : 'Both U-Net and Otsu Baseline layers must be available to compare'
      }
    >
      <GitCompare
        className={`h-4 w-4 shrink-0 transition-transform ${isCompareMode ? 'text-indigo-600 rotate-180' : 'text-stone-500'}`}
      />
      <span className="font-sans">Compare: U-Net vs. Otsu</span>
      {isCompareMode && (
        <span className="ml-0.5 rounded-full bg-indigo-200 p-0.5 text-indigo-800">
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};
