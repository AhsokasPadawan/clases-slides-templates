import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { ExamExerciseItem, ExamParadigmCategory } from '../../domain/coreTypes';
import { SectionTheme } from '../../domain/sectionThemes';

export interface PracticeFilterOption {
  label: string;
  value: string;
}

export interface PracticeFilterBarProps {
  headingTitle: string;
  exercises: readonly ExamExerciseItem[];
  currentExercise: ExamExerciseItem;
  activeIndex: number;
  selectedParadigm: ExamParadigmCategory;
  selectedOrigin: string;
  searchQuery: string;
  paradigmFilters: readonly PracticeFilterOption[];
  originFilters: readonly PracticeFilterOption[];
  practiceTheme: SectionTheme;
  onSelectExercise: (exerciseId: string) => void;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
  onParadigmChange: (paradigm: ExamParadigmCategory) => void;
  onOriginChange: (origin: string) => void;
  onSearchQueryChange: (query: string) => void;
}

export function PracticeFilterBar({
  headingTitle,
  exercises,
  currentExercise,
  activeIndex,
  selectedParadigm,
  selectedOrigin,
  searchQuery,
  paradigmFilters,
  originFilters,
  practiceTheme,
  onSelectExercise,
  onSelectPrevious,
  onSelectNext,
  onParadigmChange,
  onOriginChange,
  onSearchQueryChange,
}: PracticeFilterBarProps) {
  return (
    <div
      className={`flex shrink-0 flex-col gap-2 rounded-2xl border bg-white/95 p-3 shadow-sm dark:bg-zinc-900 ${practiceTheme.cardBorderClass}`}
    >
      <h1 className="sr-only">{headingTitle}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${practiceTheme.slideBadgeClass}`}
            >
              Ejercicio #{currentExercise.number}
            </span>
            <label
              htmlFor="exam-exercise-selector"
              className={`text-xs font-bold uppercase ${practiceTheme.slideHeaderClass}`}
            >
              Seleccionar:
            </label>
          </div>
          <select
            id="exam-exercise-selector"
            aria-label="Seleccionar ejercicio de práctica"
            value={currentExercise.id}
            onChange={(event) => onSelectExercise(event.target.value)}
            className={`w-full sm:max-w-md truncate rounded-xl border px-3 py-1.5 text-xs font-bold outline-none transition sm:text-sm ${practiceTheme.counterBoxClass}`}
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                #{exercise.number} · {exercise.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onSelectPrevious}
            disabled={activeIndex === 0}
            aria-label="Ejercicio anterior"
            title="Ejercicio anterior"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-40 ${practiceTheme.secondaryButtonClass}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            className={`rounded-lg border px-2.5 py-1 text-xs font-black font-mono ${practiceTheme.counterBoxClass}`}
          >
            #{currentExercise.number} de {exercises.length}
          </div>

          <button
            type="button"
            onClick={onSelectNext}
            disabled={activeIndex === exercises.length - 1}
            aria-label="Ejercicio siguiente"
            title="Ejercicio siguiente"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition disabled:opacity-40 ${practiceTheme.secondaryButtonClass}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(paradigmFilters.length > 1 || originFilters.length > 0 || exercises.length > 3) && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-t pt-2 ${practiceTheme.cardBorderClass}`}
        >
          {paradigmFilters.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className={`font-bold mr-1 flex items-center gap-1 ${practiceTheme.slideHeaderClass}`}>
                <Filter className="h-3 w-3" /> Técnica:
              </span>
              {paradigmFilters.map((filterOption) => (
                <button
                  key={filterOption.value}
                  type="button"
                  onClick={() => onParadigmChange(filterOption.value)}
                  className={`rounded-lg px-2 py-0.5 font-semibold transition ${
                    selectedParadigm === filterOption.value
                      ? `${practiceTheme.primaryButtonClass} shadow-xs font-bold`
                      : `${practiceTheme.secondaryButtonClass} border`
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 flex-1 sm:flex-initial justify-end">
            <div className="relative w-full sm:w-auto">
              <Search className="pointer-events-none absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar consigna..."
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                className={`h-7.5 w-full sm:w-44 sm:focus:w-56 rounded-lg border pl-8 pr-2 text-xs text-zinc-900 outline-none transition dark:text-zinc-100 ${practiceTheme.accentSurfaceClass}`}
              />
            </div>

            {originFilters.length > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                {originFilters.map((originOption) => (
                  <button
                    key={originOption.value}
                    type="button"
                    onClick={() => onOriginChange(originOption.value)}
                    className={`rounded-lg px-2 py-0.5 font-semibold transition ${
                      selectedOrigin === originOption.value
                        ? `${practiceTheme.primaryButtonClass} font-bold`
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {originOption.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
