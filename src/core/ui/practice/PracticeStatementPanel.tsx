import { ReactNode } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ExamExerciseItem,
  ExamExerciseVisualResource,
} from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';
import { MathFormula } from '../MathFormula';

export interface PracticeStatementPanelProps {
  currentExercise: ExamExerciseItem;
  isCompleted: boolean;
  isSolutionAccordionOpen: boolean;
  practiceTheme: SectionTheme;
  renderVisualResource?: (
    resource: ExamExerciseVisualResource | null | undefined,
    exerciseId: string,
  ) => ReactNode;
  onToggleSolutionAccordion: () => void;
  onToggleCompletedItem: (itemId: string) => void;
}

export function PracticeStatementPanel({
  currentExercise,
  isCompleted,
  isSolutionAccordionOpen,
  practiceTheme,
  renderVisualResource,
  onToggleSolutionAccordion,
  onToggleCompletedItem,
}: PracticeStatementPanelProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border bg-white/95 p-4 shadow-sm w-full lg:w-[35%] shrink-0 overflow-visible lg:overflow-y-auto dark:bg-zinc-900 ${practiceTheme.cardBorderClass}`}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex h-5.5 px-1.5 items-center justify-center rounded-lg text-xs font-extrabold ${practiceTheme.stepBadgeClass}`}
            >
              #{currentExercise.number}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${practiceTheme.slideBadgeClass}`}
            >
              {currentExercise.paradigm}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${practiceTheme.counterBoxClass}`}
            >
              {currentExercise.difficultyLabel}
            </span>
          </div>

          <h2 className={`text-base font-extrabold sm:text-lg ${practiceTheme.titleTextClass}`}>
            {currentExercise.title}
          </h2>

          <div
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${practiceTheme.formulaCardClass}`}
          >
            Objetivo: <MathFormula expression={currentExercise.targetComplexityLatex} />
          </div>
        </div>

        <div className={`border-t pt-2.5 ${practiceTheme.cardBorderClass}`}>
          <h3 className={`text-xs font-bold uppercase ${practiceTheme.slideHeaderClass}`}>
            Consigna Formal
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-700 sm:text-sm dark:text-zinc-300 whitespace-pre-line">
            {currentExercise.problemStatement}
          </p>
          {renderVisualResource?.(currentExercise.recursoVisual, currentExercise.id)}
        </div>

        <div
          className={`rounded-xl border p-2.5 text-xs font-semibold ${practiceTheme.accentSurfaceClass} ${practiceTheme.strongTextClass}`}
        >
          <span className={`font-bold ${practiceTheme.slideHeaderClass}`}>Ejemplo: </span>
          {currentExercise.inputOutputExample}
        </div>

        <div className={`rounded-xl border ${practiceTheme.formulaContainerClass}`}>
          <button
            type="button"
            onClick={onToggleSolutionAccordion}
            className={`flex w-full items-center justify-between p-2.5 text-xs font-bold ${practiceTheme.strongTextClass}`}
          >
            <span>Clave Algorítmica y Recurrencia</span>
            {isSolutionAccordionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isSolutionAccordionOpen && currentExercise.conceptualStrategy && (
            <div
              className={`space-y-2 border-t p-2.5 text-xs text-zinc-700 dark:text-zinc-300 ${practiceTheme.cardBorderClass}`}
            >
              <div>
                <span className={`font-bold ${practiceTheme.slideHeaderClass}`}>
                  Invariante / Estrategia:
                </span>
                <p className="mt-0.5 leading-relaxed">
                  {currentExercise.conceptualStrategy.invariantAndIntuition}
                </p>
              </div>
              {currentExercise.conceptualStrategy.recurrenceOrTransitionLatex && (
                <div
                  className={`rounded-lg border p-2 text-center font-mono ${practiceTheme.formulaCardClass}`}
                >
                  <MathFormula
                    expression={currentExercise.conceptualStrategy.recurrenceOrTransitionLatex}
                  />
                </div>
              )}
              {currentExercise.complexityAnalysis && (
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>Cota Temporal: </span>
                  <strong className={practiceTheme.slideHeaderClass}>
                    {currentExercise.complexityAnalysis.temporalLatex}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`pt-3 mt-3 border-t ${practiceTheme.cardBorderClass}`}>
        <button
          type="button"
          onClick={() => onToggleCompletedItem(currentExercise.id)}
          aria-label={
            isCompleted
              ? 'Ejercicio practicado'
              : `Marcar ejercicio ${currentExercise.title} como practicado`
          }
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
            isCompleted
              ? practiceTheme.primaryButtonClass
              : practiceTheme.secondaryButtonClass
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isCompleted ? 'Ejercicio Practicado' : 'Marcar como practicado'}</span>
        </button>
      </div>
    </div>
  );
}
