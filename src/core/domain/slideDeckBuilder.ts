import {
  AlgorithmShowcaseItem,
  CodeLanguage,
  CodeSnippetsByLanguage,
  ConceptCardItem,
  ConceptSlide,
  ExamExerciseItem,
  ModuleId,
  ModuleMetadata,
  ModuleStudyData,
  ModuleSubtopicItem,
  SlideKind,
} from './coreTypes';

export type { ConceptSlide, SlideKind };

export interface SlideVisualizerBinding {
  id: string;
  title: string;
}

export interface CustomAlgorithmCodeSlideSpec {
  idSuffix: string;
  conceptTitleSuffix: string;
  badgeTitle: string;
  snippetTitleSuffix: string;
  snippets: CodeSnippetsByLanguage;
  preferredLanguage: CodeLanguage;
}

export interface ModuleOpeningQuoteSpec {
  quote: string;
  author: string;
  source?: string;
  pedagogicalContext?: string;
  conceptTitle?: string;
  conceptSubtitle?: string;
}

export interface SlideDeckBuilderConfig {
  modules: ModuleMetadata[];
  studyModulesById: Record<string, ModuleStudyData>;
  curatedModuleSlidesById?: Record<string, ConceptSlide[]>;
  moduleOpeningQuotesById?: Record<string, ModuleOpeningQuoteSpec>;
  practiceModuleId?: ModuleId;
  exercises?: ExamExerciseItem[];
  conceptVisualizersById?: Record<string, SlideVisualizerBinding>;
  algorithmVisualizersById?: Record<string, SlideVisualizerBinding>;
  customAlgorithmCodeSlidesById?: Record<string, CustomAlgorithmCodeSlideSpec[]>;
}

export function buildConceptCardSlides(
  moduleId: ModuleId,
  moduleTitle: string,
  concept: ConceptCardItem,
  conceptVisualizersById: Record<string, SlideVisualizerBinding> = {},
): ConceptSlide[] {
  const visualizerSpec = conceptVisualizersById[concept.id];
  const slides: ConceptSlide[] = [
    {
      id: `${concept.id}-theory`,
      moduleId,
      moduleTitle,
      conceptTitle: concept.title,
      conceptSubtitle: concept.badgeText,
      badgeLabel: 'Fundamento Teórico',
      slideKind: 'theory',
      partIndex: 1,
      totalParts: visualizerSpec ? 2 : 1,
      theoryData: {
        summary: concept.summary,
        bulletPoints: concept.bulletPoints,
        formulas: concept.formulas,
      },
    },
  ];

  if (visualizerSpec) {
    slides.push({
      id: `${concept.id}-visualizer`,
      moduleId,
      moduleTitle,
      conceptTitle: visualizerSpec.title,
      conceptSubtitle: concept.title,
      badgeLabel: 'Simulación / Visualización',
      slideKind: 'visualizer',
      partIndex: 2,
      totalParts: 2,
      visualizerId: visualizerSpec.id,
    });
  }

  return slides;
}

export function buildAlgorithmSlides(
  moduleId: ModuleId,
  moduleTitle: string,
  algorithm: AlgorithmShowcaseItem,
  algorithmVisualizersById: Record<string, SlideVisualizerBinding> = {},
  customAlgorithmCodeSlidesById: Record<string, CustomAlgorithmCodeSlideSpec[]> = {},
): ConceptSlide[] {
  const baseTitle = algorithm.name;
  const subtitle = algorithm.paradigmTag;
  const visualizerSpec = algorithmVisualizersById[algorithm.id];
  const customCodeSpecs = customAlgorithmCodeSlidesById[algorithm.id];
  const codeSlidesCount = customCodeSpecs && customCodeSpecs.length > 0 ? customCodeSpecs.length : 1;
  const offset = visualizerSpec ? 1 : 0;
  const totalParts = 2 + offset + codeSlidesCount;

  const complexityData = {
    temporalLatex: algorithm.worstCaseComplexityLatex,
    spatialLatex: algorithm.spaceComplexityLatex,
    bestCaseLatex: algorithm.bestCaseComplexityLatex,
    averageCaseLatex: algorithm.averageCaseComplexityLatex,
    worstCaseLatex: algorithm.worstCaseComplexityLatex,
    justification: algorithm.keyInsight,
    theoremApplied: algorithm.recurrenceOrEquationLatex,
  };

  const slides: ConceptSlide[] = [
    {
      id: `${algorithm.id}-theory`,
      moduleId,
      moduleTitle,
      conceptTitle: baseTitle,
      conceptSubtitle: subtitle,
      badgeLabel: '1. Explicación Teórica',
      slideKind: 'theory',
      partIndex: 1,
      totalParts,
      theoryData: {
        summary: algorithm.keyInsight,
        bulletPoints: algorithm.stepByStepSummary,
        formulas: [
          {
            label: 'Ecuación / Recurrencia Característica',
            latex: algorithm.recurrenceOrEquationLatex,
            description: 'Costo recurrente o relación de transición fundamental.',
          },
        ],
        keyInsight: algorithm.keyInsight,
        stepByStepSummary: algorithm.stepByStepSummary,
      },
    },
  ];

  if (visualizerSpec) {
    slides.push({
      id: `${algorithm.id}-visualizer`,
      moduleId,
      moduleTitle,
      conceptTitle: visualizerSpec.title,
      conceptSubtitle: baseTitle,
      badgeLabel: '2. Visualizador Paso a Paso',
      slideKind: 'visualizer',
      partIndex: 2,
      totalParts,
      visualizerId: visualizerSpec.id,
    });
  }

  slides.push({
    id: `${algorithm.id}-pseudocode`,
    moduleId,
    moduleTitle,
    conceptTitle: baseTitle,
    conceptSubtitle: subtitle,
    badgeLabel: `${2 + offset}. Pseudocódigo`,
    slideKind: 'pseudocode',
    partIndex: 2 + offset,
    totalParts,
    codeSnippet: {
      title: `${baseTitle} (Pseudocódigo)`,
      snippets: algorithm.codeSnippets,
      preferredLanguage: 'pseudocode',
    },
    complexityData,
  });

  if (customCodeSpecs && customCodeSpecs.length > 0) {
    customCodeSpecs.forEach((customSpec, specIndex) => {
      const partNumber = 3 + offset + specIndex;
      slides.push({
        id: `${algorithm.id}-${customSpec.idSuffix}`,
        moduleId,
        moduleTitle,
        conceptTitle: `${baseTitle}: ${customSpec.conceptTitleSuffix}`,
        conceptSubtitle: subtitle,
        badgeLabel: `${partNumber}. ${customSpec.badgeTitle}`,
        slideKind: 'code',
        partIndex: partNumber,
        totalParts,
        codeSnippet: {
          title: `${baseTitle} (${customSpec.snippetTitleSuffix})`,
          snippets: customSpec.snippets,
          preferredLanguage: customSpec.preferredLanguage,
        },
        complexityData,
      });
    });
  } else {
    slides.push({
      id: `${algorithm.id}-code`,
      moduleId,
      moduleTitle,
      conceptTitle: baseTitle,
      conceptSubtitle: subtitle,
      badgeLabel: `${3 + offset}. Implementación Java / Python`,
      slideKind: 'code',
      partIndex: 3 + offset,
      totalParts,
      codeSnippet: {
        title: `${baseTitle} (Código Ejecutable)`,
        snippets: algorithm.codeSnippets,
        preferredLanguage: 'java',
      },
      complexityData,
    });
  }

  return slides;
}

export function buildExamExerciseSlides(
  moduleId: ModuleId,
  moduleTitle: string,
  exercise: ExamExerciseItem,
): ConceptSlide[] {
  return [
    {
      id: `${exercise.id}-workspace`,
      moduleId,
      moduleTitle,
      conceptTitle: exercise.title,
      conceptSubtitle: `${exercise.paradigm} · ${exercise.difficultyLabel}`,
      badgeLabel: 'Consigna y Práctica',
      slideKind: 'exercise',
      partIndex: 1,
      totalParts: 1,
      exerciseItem: exercise,
    },
  ];
}

export function buildSlideDeck(config: SlideDeckBuilderConfig): ConceptSlide[] {
  const deck: ConceptSlide[] = [];

  for (const moduleItem of config.modules) {
    const curatedSlides = config.curatedModuleSlidesById?.[moduleItem.id];
    if (curatedSlides) {
      deck.push(...curatedSlides);
      continue;
    }

    const openingQuote = config.moduleOpeningQuotesById?.[moduleItem.id];
    if (openingQuote) {
      deck.push({
        id: `${moduleItem.id}-apertura-quote`,
        moduleId: moduleItem.id,
        moduleTitle: moduleItem.headerTitle,
        conceptTitle: openingQuote.conceptTitle ?? 'Apertura: El Alma del Grano',
        conceptSubtitle: openingQuote.conceptSubtitle ?? `${openingQuote.author} · Epígrafe`,
        badgeLabel: 'Epígrafe',
        slideKind: 'quote',
        partIndex: 1,
        totalParts: 1,
        quoteData: {
          quote: openingQuote.quote,
          author: openingQuote.author,
          source: openingQuote.source,
          pedagogicalContext: openingQuote.pedagogicalContext,
        },
      });
    }

    if (config.practiceModuleId && moduleItem.id === config.practiceModuleId) {
      for (const exercise of config.exercises ?? []) {
        deck.push(...buildExamExerciseSlides(moduleItem.id, moduleItem.headerTitle, exercise));
      }
      continue;
    }

    const moduleData = config.studyModulesById[moduleItem.id];
    if (!moduleData) {
      continue;
    }

    for (const concept of moduleData.concepts) {
      deck.push(
        ...buildConceptCardSlides(
          moduleItem.id,
          moduleItem.headerTitle,
          concept,
          config.conceptVisualizersById,
        ),
      );
    }

    for (const algorithm of moduleData.algorithms) {
      deck.push(
        ...buildAlgorithmSlides(
          moduleItem.id,
          moduleItem.headerTitle,
          algorithm,
          config.algorithmVisualizersById,
          config.customAlgorithmCodeSlidesById,
        ),
      );
    }
  }

  return deck;
}

export interface ResolveActiveSubtopicInput {
  subtopics: ModuleSubtopicItem[];
  moduleSlideIds: string[];
  activeSlideId?: string;
  activeExerciseCategory?: string;
  isPracticeModule?: boolean;
  categoryCanonicalLookup?: Record<string, string>;
}

export function resolveActiveSubtopicByConfig(
  input: ResolveActiveSubtopicInput,
): string | undefined {
  const {
    subtopics,
    moduleSlideIds,
    activeSlideId,
    activeExerciseCategory,
    isPracticeModule = false,
    categoryCanonicalLookup = {},
  } = input;

  if (subtopics.length === 0) {
    return undefined;
  }

  if (isPracticeModule) {
    if (!activeExerciseCategory) {
      return undefined;
    }
    const canonicalCategory =
      categoryCanonicalLookup[activeExerciseCategory] ?? activeExerciseCategory;
    return subtopics.find((item) => item.paradigm === canonicalCategory)?.id;
  }

  if (!activeSlideId) {
    return subtopics[0]?.id;
  }

  const directMatch = subtopics.find((item) => item.slideId === activeSlideId);
  if (directMatch) {
    return directMatch.id;
  }

  const currentIndex = moduleSlideIds.indexOf(activeSlideId);
  if (currentIndex === -1) {
    return subtopics[0]?.id;
  }

  let matchedSubtopicId = subtopics[0]?.id;
  let bestSlideIndex = -1;

  for (const subtopic of subtopics) {
    if (!subtopic.slideId) {
      continue;
    }
    const subtopicSlideIndex = moduleSlideIds.indexOf(subtopic.slideId);
    if (
      subtopicSlideIndex !== -1 &&
      subtopicSlideIndex <= currentIndex &&
      subtopicSlideIndex >= bestSlideIndex
    ) {
      bestSlideIndex = subtopicSlideIndex;
      matchedSubtopicId = subtopic.id;
    }
  }

  return matchedSubtopicId;
}
