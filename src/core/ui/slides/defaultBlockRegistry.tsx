import { ComponentType } from 'react';
import { ConceptSlide, SlideKind } from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';
import { MathFormula } from '../MathFormula';
import { ExerciseWorkspace } from '../practice/ExerciseWorkspace';
import { QuoteSlideBlock } from './QuoteSlideBlock';
import { TheorySlideBlock } from './TheorySlideBlock';

export interface SlideBlockComponentProps {
  slide: ConceptSlide;
  sectionTheme: SectionTheme;
  isMobileFeed?: boolean;
}

export type SlideBlockRegistry = Partial<
  Record<SlideKind, ComponentType<SlideBlockComponentProps>>
>;

export function DefaultComplexitySlideBlock({
  slide,
  sectionTheme,
}: SlideBlockComponentProps) {
  if (!slide.complexityData) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 h-full flex-1 min-h-0">
      <div
        className={`rounded-xl border p-4 flex flex-col justify-between ${sectionTheme.analysisPanelClass}`}
      >
        <div className={`border-b pb-2 ${sectionTheme.analysisDividerClass}`}>
          <span
            className={`text-xs font-black uppercase tracking-wider ${sectionTheme.analysisAccentTextClass}`}
          >
            Órdenes Asintóticos
          </span>
        </div>
        <div className="my-auto space-y-3">
          <div className={`rounded-xl border p-3 ${sectionTheme.analysisSubcardClass}`}>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase">
              Tiempo
            </span>
            <div className={`mt-1 text-base sm:text-lg font-bold ${sectionTheme.titleTextClass}`}>
              <MathFormula expression={slide.complexityData.temporalLatex} />
            </div>
          </div>
          <div className={`rounded-xl border p-3 ${sectionTheme.analysisSubcardClass}`}>
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase">
              Espacio
            </span>
            <div className={`mt-1 text-base sm:text-lg font-bold ${sectionTheme.titleTextClass}`}>
              <MathFormula expression={slide.complexityData.spatialLatex} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col justify-between rounded-xl border p-4 shadow-xs ${sectionTheme.accentSurfaceClass}`}
      >
        <div>
          <div className={`border-b pb-2 mb-3 ${sectionTheme.cardBorderClass}`}>
            <span
              className={`text-xs font-black uppercase tracking-wider ${sectionTheme.slideHeaderClass}`}
            >
              Análisis y Justificación
            </span>
          </div>
          {slide.complexityData.theoremApplied && (
            <div className="mb-3">
              <p className={`text-xs font-bold uppercase ${sectionTheme.slideHeaderClass}`}>
                Recurrencia / Teorema
              </p>
              <p className={`mt-1 text-xs sm:text-sm font-semibold ${sectionTheme.titleTextClass}`}>
                {slide.complexityData.theoremApplied}
              </p>
            </div>
          )}
          <p className={`text-xs font-bold uppercase ${sectionTheme.slideHeaderClass}`}>
            Justificación
          </p>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {slide.complexityData.justification}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DefaultExerciseSlideBlock({
  slide,
  sectionTheme,
}: SlideBlockComponentProps) {
  if (!slide.exerciseItem) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-y-auto lg:flex-row">
      <div
        className={`shrink-0 space-y-2.5 rounded-xl border p-3 overflow-y-auto lg:w-[30%] ${sectionTheme.accentSurfaceClass}`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
            {slide.exerciseItem.paradigm}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sectionTheme.slideBadgeClass}`}
          >
            {slide.exerciseItem.difficultyLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${sectionTheme.formulaCardClass}`}
          >
            Objetivo: <MathFormula expression={slide.exerciseItem.targetComplexityLatex} />
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
          {slide.exerciseItem.problemStatement}
        </p>
        <div
          className={`rounded-lg border bg-white/80 p-2.5 text-xs font-semibold dark:bg-zinc-900 ${sectionTheme.cardBorderClass} ${sectionTheme.strongTextClass}`}
        >
          {slide.exerciseItem.inputOutputExample}
        </div>
      </div>

      <div className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-y-auto">
        <ExerciseWorkspace
          exerciseId={slide.exerciseItem.id}
          exerciseTitle={slide.exerciseItem.title}
        />
      </div>
    </div>
  );
}

export const defaultBlockRegistry: SlideBlockRegistry = {
  quote: QuoteSlideBlock,
  theory: TheorySlideBlock,
  complexity: DefaultComplexitySlideBlock,
  exercise: DefaultExerciseSlideBlock,
};
