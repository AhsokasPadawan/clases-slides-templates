import {
  ConceptSlide,
  ExamExerciseItem,
  ExamParadigmCategory,
  ModuleId,
} from '../domain/coreTypes';
import { SearchableStudyEntry } from '../domain/studySearch';

export function calculateStudyProgressPercentage(
  completedItemIds: readonly string[],
  trackableItemIds: readonly string[],
): number {
  if (trackableItemIds.length === 0) return 0;
  const completedCount = trackableItemIds.filter((itemId) =>
    completedItemIds.includes(itemId),
  ).length;
  return Math.round((completedCount / trackableItemIds.length) * 100);
}

export function findFirstModuleSlideIndex(
  slides: readonly ConceptSlide[],
  moduleId: ModuleId,
): number {
  return slides.findIndex((slide) => slide.moduleId === moduleId);
}

export function findMatchingPracticeExercise(
  exercises: readonly ExamExerciseItem[],
  paradigm: ExamParadigmCategory,
  matchesPracticeCategory?: (
    exercise: ExamExerciseItem,
    selectedCategory: ExamParadigmCategory,
  ) => boolean,
): ExamExerciseItem | undefined {
  const categoryMatcher =
    matchesPracticeCategory ??
    ((item: ExamExerciseItem, category: ExamParadigmCategory) =>
      item.paradigm === category);
  return exercises.find((exercise) => categoryMatcher(exercise, paradigm));
}

export function resolveSearchSelectionTarget(
  entry: SearchableStudyEntry,
  slides: readonly ConceptSlide[],
  exercises: readonly ExamExerciseItem[],
  practiceModuleId?: ModuleId,
): { targetSlideIndex?: number; targetExerciseId?: string } {
  if (entry.moduleId === practiceModuleId) {
    const matchingExercise = exercises.find(
      (exercise) =>
        exercise.id === entry.anchorId ||
        exercise.title.toLowerCase().includes(entry.title.toLowerCase()),
    );
    return { targetExerciseId: matchingExercise?.id };
  }

  const matchingSlideIndex = slides.findIndex(
    (slide) =>
      slide.id.startsWith(entry.anchorId) ||
      slide.conceptTitle.toLowerCase().includes(entry.title.toLowerCase()),
  );
  return {
    targetSlideIndex: matchingSlideIndex !== -1 ? matchingSlideIndex : undefined,
  };
}
