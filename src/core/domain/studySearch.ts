import {
  ExamExerciseItem,
  ModuleId,
  ModuleMetadata,
  ModuleStudyData,
} from './coreTypes';

export interface SearchableStudyEntry {
  anchorId: string;
  title: string;
  moduleId: ModuleId;
  moduleLabel: string;
  kindLabel: string;
  searchableText: string;
}

export interface StudySearchIndexInput {
  modules: ModuleMetadata[];
  studyModulesById: Record<string, ModuleStudyData>;
  exercises?: ExamExerciseItem[];
  practiceModuleId?: ModuleId;
  conceptKindLabel?: string;
  algorithmKindLabel?: string;
  exerciseKindLabel?: string;
}

const DEFAULT_MAX_SEARCH_RESULTS = 8;

export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function findModuleLabel(
  modules: ModuleMetadata[],
  moduleId: ModuleId,
): string {
  return modules.find((moduleItem) => moduleItem.id === moduleId)?.sidebarTitle ?? '';
}

export function buildStudySearchIndex(
  input: StudySearchIndexInput,
): SearchableStudyEntry[] {
  const {
    modules,
    studyModulesById,
    exercises = [],
    practiceModuleId,
    conceptKindLabel = 'Concepto',
    algorithmKindLabel = 'Algoritmo',
    exerciseKindLabel = 'Ejercicio de Parcial',
  } = input;

  const moduleEntries = Object.values(studyModulesById).flatMap((moduleData) => {
    const moduleId = moduleData.metadata.id;
    const moduleLabel = findModuleLabel(modules, moduleId);

    const conceptEntries = moduleData.concepts.map((concept) => ({
      anchorId: concept.id,
      title: concept.title,
      moduleId,
      moduleLabel,
      kindLabel: conceptKindLabel,
      searchableText: normalizeForSearch(
        `${concept.title} ${concept.badgeText} ${concept.summary}`,
      ),
    }));

    const algorithmEntries = moduleData.algorithms.map((algorithm) => ({
      anchorId: algorithm.id,
      title: algorithm.name,
      moduleId,
      moduleLabel,
      kindLabel: algorithmKindLabel,
      searchableText: normalizeForSearch(
        `${algorithm.name} ${algorithm.paradigmTag} ${algorithm.keyInsight}`,
      ),
    }));

    return [...conceptEntries, ...algorithmEntries];
  });

  if (!practiceModuleId || exercises.length === 0) {
    return moduleEntries;
  }

  const practiceLabel = findModuleLabel(modules, practiceModuleId);
  const exerciseEntries = exercises.map((exercise) => ({
    anchorId: exercise.id,
    title: exercise.title,
    moduleId: practiceModuleId,
    moduleLabel: practiceLabel,
    kindLabel: exerciseKindLabel,
    searchableText: normalizeForSearch(
      `${exercise.title} ${exercise.paradigm} ${exercise.problemStatement}`,
    ),
  }));

  return [...moduleEntries, ...exerciseEntries];
}

export function searchStudyEntries(
  query: string,
  entries: readonly SearchableStudyEntry[],
  maxResults: number = DEFAULT_MAX_SEARCH_RESULTS,
): SearchableStudyEntry[] {
  const normalizedQuery = normalizeForSearch(query.trim());
  if (!normalizedQuery) {
    return [];
  }

  const titleMatches = entries.filter((entry) =>
    normalizeForSearch(entry.title).includes(normalizedQuery),
  );
  const bodyMatches = entries.filter(
    (entry) =>
      !titleMatches.includes(entry) &&
      entry.searchableText.includes(normalizedQuery),
  );

  return [...titleMatches, ...bodyMatches].slice(0, maxResults);
}
