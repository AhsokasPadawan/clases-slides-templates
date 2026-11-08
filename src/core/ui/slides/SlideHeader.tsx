import { ConceptSlide } from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';

export interface SlideHeaderProps {
  slide: ConceptSlide;
  moduleSlideIndex: number;
  moduleSlidesCount: number;
  isExercise: boolean;
  exerciseNumber?: number;
  sectionTheme: SectionTheme;
}

export function SlideHeader({
  slide,
  moduleSlideIndex,
  moduleSlidesCount,
  isExercise,
  exerciseNumber,
  sectionTheme,
}: SlideHeaderProps) {
  return (
    <div
      className={`shrink-0 border-b pb-2.5 ${sectionTheme.cardBorderClass} flex items-center justify-between gap-3`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${sectionTheme.slideBadgeClass}`}
          >
            {isExercise && exerciseNumber !== undefined
              ? `Ejercicio #${exerciseNumber}`
              : `Diapositiva #${moduleSlideIndex + 1}`}
          </span>
          <h1
            className={`text-xs sm:text-sm font-black uppercase tracking-wider truncate ${sectionTheme.slideHeaderClass}`}
          >
            {slide.moduleTitle}
          </h1>
        </div>
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-black truncate mt-0.5 ${sectionTheme.titleTextClass}`}
        >
          {slide.conceptTitle}
        </h2>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <div
          className={`rounded-xl border px-3.5 py-1 text-center ${sectionTheme.counterBoxClass}`}
        >
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider leading-none opacity-80">
            {isExercise && exerciseNumber !== undefined ? 'Ejercicio' : 'Diapositiva'}
          </div>
          <div className="font-mono text-sm sm:text-base md:text-lg font-black leading-tight">
            {isExercise && exerciseNumber !== undefined ? (
              `#${exerciseNumber}`
            ) : (
              <>
                {moduleSlideIndex + 1}{' '}
                <span className="text-xs font-normal opacity-60">/ {moduleSlidesCount}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
