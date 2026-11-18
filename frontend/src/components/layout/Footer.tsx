import React from 'react';
import { ShieldCheck, Satellite } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-ink-border bg-white py-6 text-xs text-ink-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-600">
            <Satellite className="h-4 w-4 text-haor-600 shrink-0" />
            <span>
              Copernicus Sentinel-1 SAR &bull; JRC Global Surface Water &bull; ESA WorldCover 10m
            </span>
          </div>

          <div className="flex items-center gap-2 text-amber-800 bg-amber-50/70 border border-amber-200/60 rounded-md px-3 py-1.5 text-center sm:text-left">
            <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0 hidden sm:inline" />
            <span>
              <strong>Domain Guardrail:</strong> Overlap estimates denote <em>potentially exposed agricultural land</em>, not verified crop damage or yield loss. No real-time forecasting.
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-400">
          <span>HaorWatch AI &bull; Sylhet Wetland Monitoring Pilot</span>
          <span>Open Geodata &bull; Transparent Model Accountability</span>
        </div>
      </div>
    </footer>
  );
};
