import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Sparkles, ShieldAlert, ChevronDown, ChevronUp, Waves, Sprout } from 'lucide-react';
import { useReport } from '../../hooks/useHaorWatch';
import { Skeleton } from '../ui/Skeleton';

interface BanglaBriefingStripProps {
  analysisId: string | undefined;
}

export const BanglaBriefingStrip: React.FC<BanglaBriefingStripProps> = ({ analysisId }) => {
  const { data: report, isLoading, isError } = useReport(analysisId, 'bn');
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return null;
  }

  const isTemplate = report.generation_method === 'template';

  return (
    <section
      aria-label="Bangla Summary Briefing"
      className="relative rounded-xl border border-ink-border bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-card"
    >
      {/* Header Controls: Perfectly Even Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-7 items-center gap-1.5 rounded-lg bg-stone-100 border border-stone-200 px-2.5 text-xs font-bold text-stone-700">
            <FileText className="h-3.5 w-3.5 text-haor-600 shrink-0" />
            <span>বাংলা সারসংক্ষেপ</span>
          </div>

          <span
            className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold border ${
              isTemplate
                ? 'bg-stone-50 text-stone-700 border-stone-200'
                : 'bg-teal-50 text-haor-800 border-teal-200'
            }`}
          >
            {isTemplate ? (
              <span>Template</span>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-haor-600" />
                <span>AI-Phrased</span>
              </>
            )}
          </span>

          <span className="flex h-7 items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 text-xs font-bold text-amber-900 border border-amber-200">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>সম্ভাব্য কৃষিজমি সংস্পর্শ &bull; ক্ষতি নয়</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-7 items-center gap-1 rounded-lg border border-stone-200 px-2.5 text-xs font-semibold text-stone-600 hover:text-ink hover:bg-stone-50 transition-colors"
          >
            <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত বিবরণ'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <Link
            to="/report"
            className="flex h-7 items-center gap-1 rounded-lg bg-haor-50 border border-haor-200 px-2.5 text-xs font-bold text-haor-700 hover:bg-haor-100 hover:text-haor-800 transition-colors"
          >
            <span>পূর্ণাঙ্গ প্রতিবেদন</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Visual Metric Callout Chips */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-lg border border-sky-100 bg-sky-50/60 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-100 text-[#0284C7] shrink-0">
            <Waves className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-sky-800">প্লাবিত এলাকা</div>
            <div className="font-bangla font-bold text-base text-sky-950">৮৪.৬২ বর্গ কিমি</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-amber-100 bg-amber-50/60 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-[#D97706] shrink-0">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-amber-800">ঝুঁকিপূর্ণ কৃষিজমি</div>
            <div className="font-bangla font-bold text-base text-amber-950">৩১.২৫ বর্গ কিমি (৩৬.৯%)</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-lg border border-stone-200/80 bg-stone-50 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-200 text-stone-700 shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-stone-600">স্থায়ী জলাশয় স্তর</div>
            <div className="font-bangla font-bold text-sm text-ink">জেআরসি ফিল্টারিং প্রযুক্ত</div>
          </div>
        </div>
      </div>

      {/* Concise Insight Text with Optional Expand */}
      <div className="mt-3.5">
        <h4 className="font-bangla text-sm font-bold text-ink leading-snug">
          {report.title}
        </h4>
        <p className={`mt-1 font-bangla text-xs text-stone-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {report.body}
        </p>
      </div>
    </section>
  );
};
