import { MathFormula } from '../../core/ui/MathFormula';
import { ExerciseWorkspace } from '../../core/ui/practice/ExerciseWorkspace';
import {
  DefaultComplexitySlideBlock,
  SlideBlockComponentProps,
} from '../../core/ui/slides/defaultBlockRegistry';
import { tokenizeCode } from '../domain/codeSyntaxHighlighter';
import { AnnotatedCodeBlock } from './AnnotatedCodeBlock';
import { ExerciseVisualResource } from './ExerciseVisualResource';
import { IdeCodeBlock } from './IdeCodeBlock';

export function CodeSlideBlock({ slide, sectionTheme }: SlideBlockComponentProps) {
  if (!slide.codeSnippet) return null;
  return (
    <div className="h-full min-h-0 flex-1 flex flex-col">
      <IdeCodeBlock
        key={`${slide.id}-${slide.codeSnippet.preferredLanguage}`}
        title={slide.codeSnippet.title}
        snippets={slide.codeSnippet.snippets}
        initialLanguage={slide.codeSnippet.preferredLanguage}
        sectionTheme={sectionTheme}
      />
    </div>
  );
}

export function ComplexitySlideBlock({ slide, sectionTheme }: SlideBlockComponentProps) {
  if (!slide.complexityData) return null;
  if (!slide.codeSnippet) {
    return <DefaultComplexitySlideBlock slide={slide} sectionTheme={sectionTheme} />;
  }

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden">
      <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full">
        <AnnotatedCodeBlock
          key={`${slide.id}-${slide.codeSnippet.preferredLanguage}`}
          title={slide.codeSnippet.title}
          snippets={slide.codeSnippet.snippets}
          annotations={slide.complexityData.annotations || []}
          initialLanguage={slide.codeSnippet.preferredLanguage}
          showAnnotationsDefault={true}
          sectionTheme={sectionTheme}
        />
      </div>

      <div className={`shrink-0 lg:w-80 xl:w-96 flex flex-col justify-between gap-1.5 sm:gap-2 rounded-2xl border p-2.5 sm:p-3 overflow-hidden ${sectionTheme.analysisPanelClass}`}>
        <div className={`border-b pb-1.5 flex items-center justify-between shrink-0 ${sectionTheme.analysisDividerClass}`}>
          <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${sectionTheme.analysisAccentTextClass}`}>
            Análisis Asintótico
          </span>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-transparent px-2 py-0.5 rounded border-2 border-amber-400">
            Cotas en Amarillo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 shrink-0">
          <div className={`rounded-xl border p-1.5 sm:p-2 ${sectionTheme.analysisSubcardClass}`}>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
              Tiempo (Peor)
            </span>
            <div className={`mt-0.5 text-xs sm:text-sm md:text-base font-black ${sectionTheme.titleTextClass}`}>
              <MathFormula expression={slide.complexityData.temporalLatex} />
            </div>
          </div>

          <div className={`rounded-xl border p-1.5 sm:p-2 ${sectionTheme.analysisSubcardClass}`}>
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wide">
              Espacio Auxiliar
            </span>
            <div className={`mt-0.5 text-xs sm:text-sm md:text-base font-black ${sectionTheme.titleTextClass}`}>
              <MathFormula expression={slide.complexityData.spatialLatex} />
            </div>
          </div>
        </div>

        {slide.complexityData.bestCaseLatex && slide.complexityData.worstCaseLatex && (
          <div className={`rounded-xl border p-1.5 shrink-0 ${sectionTheme.analysisSubcardClass}`}>
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide ${sectionTheme.analysisAccentTextClass}`}>
              Desglose por Casos
            </span>
            <div className="mt-1 grid grid-cols-3 gap-1 text-center">
              <div className={`rounded-lg p-1 border ${sectionTheme.analysisInnerCellClass}`}>
                <span className={`block text-[8px] sm:text-[9px] uppercase font-bold ${sectionTheme.analysisAccentTextClass}`}>Mejor</span>
                <div className={`text-[11px] sm:text-xs font-bold mt-0.5 ${sectionTheme.titleTextClass}`}>
                  <MathFormula expression={slide.complexityData.bestCaseLatex} />
                </div>
              </div>
              <div className={`rounded-lg p-1 border ${sectionTheme.analysisInnerCellClass}`}>
                <span className={`block text-[8px] sm:text-[9px] uppercase font-bold ${sectionTheme.analysisAccentTextClass}`}>Promedio</span>
                <div className={`text-[11px] sm:text-xs font-bold mt-0.5 ${sectionTheme.titleTextClass}`}>
                  <MathFormula expression={slide.complexityData.averageCaseLatex || slide.complexityData.temporalLatex} />
                </div>
              </div>
              <div className={`rounded-lg p-1 border ${sectionTheme.analysisInnerCellClass}`}>
                <span className={`block text-[8px] sm:text-[9px] uppercase font-bold ${sectionTheme.analysisAccentTextClass}`}>Peor</span>
                <div className={`text-[11px] sm:text-xs font-bold mt-0.5 ${sectionTheme.titleTextClass}`}>
                  <MathFormula expression={slide.complexityData.worstCaseLatex} />
                </div>
              </div>
            </div>
          </div>
        )}

        {slide.complexityData.theoremApplied && (
          <div className={`rounded-xl border p-1.5 shrink-0 ${sectionTheme.analysisSubcardClass}`}>
            <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide mb-0.5 ${sectionTheme.analysisAccentTextClass}`}>
              Ecuación de Recurrencia / Deducción
            </p>
            <div className={`text-[11px] sm:text-xs font-semibold overflow-x-auto overflow-y-hidden py-0.5 ${sectionTheme.titleTextClass}`}>
              <MathFormula expression={slide.complexityData.theoremApplied} />
            </div>
          </div>
        )}

        <div className={`rounded-xl border p-2 sm:p-2.5 flex-1 min-h-0 flex flex-col justify-center ${sectionTheme.analysisSubcardClass}`}>
          <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide mb-0.5 ${sectionTheme.analysisAccentTextClass}`}>
            Justificación Analítica
          </p>
          <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
            {slide.complexityData.justification}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CourseExerciseSlideBlock({ slide, sectionTheme }: SlideBlockComponentProps) {
  if (!slide.exerciseItem) return null;
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-y-auto lg:flex-row">
      <div className={`shrink-0 space-y-2.5 rounded-xl border p-3 overflow-y-auto lg:w-[30%] ${sectionTheme.accentSurfaceClass}`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
            {slide.exerciseItem.paradigm}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${sectionTheme.slideBadgeClass}`}>
            {slide.exerciseItem.difficultyLabel}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${sectionTheme.formulaCardClass}`}>
            Objetivo: <MathFormula expression={slide.exerciseItem.targetComplexityLatex} />
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
          {slide.exerciseItem.problemStatement}
        </p>
        <ExerciseVisualResource
          resource={slide.exerciseItem.recursoVisual}
          exerciseId={slide.exerciseItem.id}
        />
        <div className={`rounded-lg border bg-white/80 p-2.5 text-xs font-semibold dark:bg-zinc-900 ${sectionTheme.cardBorderClass} ${sectionTheme.strongTextClass}`}>
          {slide.exerciseItem.inputOutputExample}
        </div>
      </div>

      <div className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-y-auto">
        <ExerciseWorkspace
          exerciseId={slide.exerciseItem.id}
          exerciseTitle={slide.exerciseItem.title}
          tokenizeCode={tokenizeCode}
        />
      </div>
    </div>
  );
}
