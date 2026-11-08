import { ReactNode, useState } from 'react';
import {
  ExamExerciseItem,
  ExamExerciseVisualResource,
  ExamParadigmCategory,
  ModuleId,
} from '../../domain/coreTypes';
import { SECTION_THEMES } from '../../domain/sectionThemes';
import { ExerciseWorkspace, WorkspaceCodeTokenizer } from './ExerciseWorkspace';
import { PracticeFilterBar, PracticeFilterOption } from './PracticeFilterBar';
import { PracticeStatementPanel } from './PracticeStatementPanel';

export interface ExamPracticeViewProps {
  exercises: readonly ExamExerciseItem[];
  completedItemIds: string[];
  selectedExerciseId: string;
  selectedParadigmFilter?: ExamParadigmCategory;
  headingTitle?: string;
  practiceModuleId?: ModuleId;
  paradigmFilters?: readonly PracticeFilterOption[];
  originFilters?: readonly PracticeFilterOption[];
  matchesCategory?: (
    exercise: ExamExerciseItem,
    selectedCategory: ExamParadigmCategory,
  ) => boolean;
  renderVisualResource?: (
    resource: ExamExerciseVisualResource | null | undefined,
    exerciseId: string,
  ) => ReactNode;
  tokenizeCode?: WorkspaceCodeTokenizer;
  onSelectExercise: (exerciseId: string) => void;
  onSelectParadigmFilter?: (paradigm: ExamParadigmCategory) => void;
  onToggleCompletedItem: (itemId: string) => void;
}

const DEFAULT_ORIGIN_FILTERS: readonly PracticeFilterOption[] = [];

function defaultMatchesCategory(
  exercise: ExamExerciseItem,
  selectedCategory: ExamParadigmCategory,
): boolean {
  return selectedCategory === 'all' || exercise.paradigm === selectedCategory;
}

function buildDefaultParadigmFilters(
  exercises: readonly ExamExerciseItem[],
): PracticeFilterOption[] {
  const uniqueParadigms = Array.from(new Set(exercises.map((item) => item.paradigm)));
  return [
    { label: 'Todos', value: 'all' },
    ...uniqueParadigms.map((paradigm) => ({ label: paradigm, value: paradigm })),
  ];
}

export function ExamPracticeView({
  exercises,
  completedItemIds,
  selectedExerciseId,
  selectedParadigmFilter,
  headingTitle = 'Banco de Ejercicios de Parcial y Patrones de Examen',
  practiceModuleId = 'fuchsia',
  paradigmFilters,
  originFilters = DEFAULT_ORIGIN_FILTERS,
  matchesCategory = defaultMatchesCategory,
  renderVisualResource,
  tokenizeCode,
  onSelectExercise,
  onSelectParadigmFilter,
  onToggleCompletedItem,
}: ExamPracticeViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalParadigm, setInternalParadigm] = useState<ExamParadigmCategory>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [isSolutionAccordionOpen, setIsSolutionAccordionOpen] = useState<boolean>(false);

  const selectedParadigm = selectedParadigmFilter ?? internalParadigm;
  const practiceTheme = SECTION_THEMES[practiceModuleId];
  const resolvedParadigmFilters =
    paradigmFilters ?? buildDefaultParadigmFilters(exercises);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesQuery =
      searchQuery.trim() === '' ||
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.paradigm.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrigin =
      selectedOrigin === 'all' || exercise.sourceOrigin === selectedOrigin;

    return (
      matchesQuery &&
      matchesCategory(exercise, selectedParadigm) &&
      matchesOrigin
    );
  });

  const effectiveList = filteredExercises.length > 0 ? filteredExercises : exercises;
  const currentIndex = effectiveList.findIndex(
    (exercise) => exercise.id === selectedExerciseId,
  );
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentExercise = effectiveList[activeIndex] ?? exercises[0];
  const isCompleted = completedItemIds.includes(currentExercise.id);

  const handleParadigmChange = (paradigm: ExamParadigmCategory) => {
    setInternalParadigm(paradigm);
    onSelectParadigmFilter?.(paradigm);
    const subset = exercises.filter((item) => matchesCategory(item, paradigm));
    if (subset.length > 0 && !subset.some((item) => item.id === selectedExerciseId)) {
      onSelectExercise(subset[0].id);
    }
  };

  const handleOriginChange = (origin: string) => {
    setSelectedOrigin(origin);
    const subset = exercises.filter((item) =>
      origin === 'all' ? true : item.sourceOrigin === origin,
    );
    if (subset.length > 0 && !subset.some((item) => item.id === selectedExerciseId)) {
      onSelectExercise(subset[0].id);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full h-auto lg:h-full lg:flex-1 lg:overflow-hidden p-2.5 sm:p-4 pb-24">
      <PracticeFilterBar
        headingTitle={headingTitle}
        exercises={effectiveList}
        currentExercise={currentExercise}
        activeIndex={activeIndex}
        selectedParadigm={selectedParadigm}
        selectedOrigin={selectedOrigin}
        searchQuery={searchQuery}
        paradigmFilters={resolvedParadigmFilters}
        originFilters={originFilters}
        practiceTheme={practiceTheme}
        onSelectExercise={onSelectExercise}
        onSelectPrevious={() =>
          activeIndex > 0 && onSelectExercise(effectiveList[activeIndex - 1].id)
        }
        onSelectNext={() =>
          activeIndex < effectiveList.length - 1 &&
          onSelectExercise(effectiveList[activeIndex + 1].id)
        }
        onParadigmChange={handleParadigmChange}
        onOriginChange={handleOriginChange}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="flex flex-col lg:flex-row gap-3 w-full h-auto lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        <PracticeStatementPanel
          currentExercise={currentExercise}
          isCompleted={isCompleted}
          isSolutionAccordionOpen={isSolutionAccordionOpen}
          practiceTheme={practiceTheme}
          renderVisualResource={renderVisualResource}
          onToggleSolutionAccordion={() =>
            setIsSolutionAccordionOpen((previous) => !previous)
          }
          onToggleCompletedItem={onToggleCompletedItem}
        />

        <div className="w-full lg:flex-1 min-h-[480px] lg:min-h-0 flex flex-col overflow-visible lg:overflow-hidden">
          <ExerciseWorkspace
            key={currentExercise.id}
            exerciseId={currentExercise.id}
            exerciseTitle={currentExercise.title}
            tokenizeCode={tokenizeCode}
          />
        </div>
      </div>
    </div>
  );
}
