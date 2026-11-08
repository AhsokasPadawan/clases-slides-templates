import { ReactNode } from 'react';

interface OriginalArrayBannerProps {
  titleLabel: string;
  subtitleBadge: string;
  values: readonly number[];
}

export function OriginalArrayBanner({
  titleLabel,
  subtitleBadge,
  values,
}: OriginalArrayBannerProps) {
  return (
    <div className="shrink-0 w-full flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-800/40 bg-zinc-950/70 px-3 py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-bold text-zinc-300 font-sans">
          {titleLabel}
        </span>
        <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-400">
          {subtitleBadge}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
        {values.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 leading-none mb-0.5">
              {idx}
            </span>
            <span className="flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-zinc-900 border border-rose-900/60 text-zinc-200 font-mono text-xs sm:text-sm font-bold shadow-xs">
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface VisualizerMetricCardProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

export function VisualizerMetricCard({
  label,
  value,
  valueClassName = 'text-rose-300',
}: VisualizerMetricCardProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-rose-800/40 bg-rose-950/80 p-1.5 sm:p-2 shadow-xs">
      <span className="text-[10px] sm:text-[11px] uppercase font-sans font-bold text-zinc-400">
        {label}
      </span>
      <span className={`font-bold truncate ${valueClassName}`}>{value}</span>
    </div>
  );
}
