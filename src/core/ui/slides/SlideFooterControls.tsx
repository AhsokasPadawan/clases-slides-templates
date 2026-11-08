import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTheme } from '../../domain/sectionThemes';

export interface SlideFooterControlsProps {
  conceptSubtitle: string;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  isExercise: boolean;
  exerciseNumber?: number;
  moduleSlideIndex: number;
  moduleSlidesCount: number;
  sectionTheme: SectionTheme;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  isMobileFeed?: boolean;
}

export function SlideFooterControls({
  conceptSubtitle,
  isFirstSlide,
  isLastSlide,
  isExercise,
  exerciseNumber,
  moduleSlideIndex,
  moduleSlidesCount,
  sectionTheme,
  onNavigatePrevious,
  onNavigateNext,
  isMobileFeed,
}: SlideFooterControlsProps) {
  if (isMobileFeed) {
    return (
      <footer
        className={`shrink-0 border-t pt-2.5 ${sectionTheme.cardBorderClass} flex items-center justify-between gap-3`}
      >
        <span
          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${sectionTheme.counterBoxClass}`}
        >
          {isExercise && exerciseNumber !== undefined
            ? `Ejercicio #${exerciseNumber}`
            : `Diapositiva ${moduleSlideIndex + 1} / ${moduleSlidesCount}`}
        </span>

        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 truncate text-right">
          {conceptSubtitle}
        </span>
      </footer>
    );
  }

  return (
    <footer
      className={`shrink-0 border-t pt-2.5 ${sectionTheme.cardBorderClass} flex items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNavigatePrevious}
          disabled={isFirstSlide}
          aria-label="Diapositiva anterior"
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${sectionTheme.secondaryButtonClass}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </button>

        <span
          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${sectionTheme.counterBoxClass}`}
        >
          {isExercise && exerciseNumber !== undefined
            ? `Ejercicio #${exerciseNumber}`
            : `Diapositiva ${moduleSlideIndex + 1} / ${moduleSlidesCount}`}
        </span>

        <button
          type="button"
          onClick={onNavigateNext}
          disabled={isLastSlide}
          aria-label="Diapositiva siguiente"
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${sectionTheme.primaryButtonClass}`}
        >
          <span>Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 truncate">
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 truncate">
          {conceptSubtitle}
        </span>
        <span className="hidden md:inline-block rounded-md bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-500">
          ← / →
        </span>
      </div>
    </footer>
  );
}
