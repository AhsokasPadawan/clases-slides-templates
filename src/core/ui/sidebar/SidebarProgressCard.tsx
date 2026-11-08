import { SectionTheme } from '../../domain/sectionThemes';

export interface SidebarProgressCardProps {
  progressPercentage: number;
  activeTheme: SectionTheme;
}

export function SidebarProgressCard({
  progressPercentage,
  activeTheme,
}: SidebarProgressCardProps) {
  return (
    <div className="mt-auto shrink-0 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span id="study-progress-label" className="text-zinc-700 dark:text-zinc-300">
          Progreso de repaso
        </span>
        <span className="text-zinc-900 font-bold dark:text-white">{progressPercentage}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="study-progress-label"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercentage}
        className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${activeTheme.dotClass}`}
          style={{ width: `${progressPercentage}%` }}
          data-progress={progressPercentage}
        />
      </div>
      <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        Módulos repasados y ejercicios practicados.
      </p>
    </div>
  );
}
