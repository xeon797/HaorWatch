import React, { useRef, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface SplitCurtainSliderProps {
  splitPosition: number; // 0 to 100 percentage
  onPositionChange: (pos: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const SplitCurtainSlider: React.FC<SplitCurtainSliderProps> = ({
  splitPosition,
  onPositionChange,
  containerRef,
}) => {
  const isDraggingRef = useRef(false);

  const updatePositionFromClientX = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
      onPositionChange(Math.round(percentage));
    },
    [containerRef, onPositionChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      onPositionChange(Math.max(5, splitPosition - 5));
    } else if (e.key === 'ArrowRight') {
      onPositionChange(Math.min(95, splitPosition + 5));
    }
  };

  return (
    <>
      {/* Draggable Vertical Divider Line */}
      <div
        className="absolute top-0 bottom-0 z-[1050] w-1 -ml-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] cursor-ew-resize select-none pointer-events-auto"
        style={{ left: `${splitPosition}%` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        tabIndex={0}
        role="slider"
        aria-label="U-Net ML versus Otsu Baseline Split Position"
        aria-valuenow={splitPosition}
        aria-valuemin={5}
        aria-valuemax={95}
        onKeyDown={handleKeyDown}
      >
        {/* Center Circular Drag Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-300 bg-white shadow-md text-ink hover:scale-110 active:scale-95 transition-transform">
          <ChevronsLeftRight className="h-4 w-4 text-stone-700" />
        </div>
      </div>

      {/* Floating Side Indicators (Top Viewport) */}
      <div className="absolute top-16 left-0 right-0 z-[1040] pointer-events-none flex justify-between px-6">
        <div
          className="transition-opacity duration-200"
          style={{
            opacity: splitPosition < 15 ? 0 : 1,
          }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-300 bg-sky-50/95 px-2.5 py-1 text-xs font-bold text-sky-900 shadow-xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
            <span>Left: U-Net ML Detection</span>
          </span>
        </div>

        <div
          className="transition-opacity duration-200"
          style={{
            opacity: splitPosition > 85 ? 0 : 1,
          }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-300 bg-indigo-50/95 px-2.5 py-1 text-xs font-bold text-indigo-900 shadow-xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
            <span>Right: Otsu SAR Baseline</span>
          </span>
        </div>
      </div>

      {/* Split Position Quick Presets (Bottom Center) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1040] flex items-center gap-1 rounded-full border border-stone-200 bg-white/95 px-2 py-1 shadow-xs backdrop-blur-xs">
        <span className="text-[11px] font-semibold text-stone-500 px-1.5">Split:</span>
        {[25, 50, 75].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => onPositionChange(pct)}
            className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums transition-colors ${
              splitPosition === pct
                ? 'bg-indigo-600 text-white'
                : 'text-stone-600 hover:bg-stone-100 hover:text-ink'
            }`}
          >
            {pct}%
          </button>
        ))}
      </div>
    </>
  );
};
