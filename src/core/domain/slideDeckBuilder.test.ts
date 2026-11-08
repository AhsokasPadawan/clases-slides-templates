import { describe, expect, it } from 'vitest';
import {
  ConceptSlide,
  ModuleMetadata,
  ModuleStudyData,
  ModuleSubtopicItem,
} from './coreTypes';
import {
  buildSlideDeck,
  resolveActiveSubtopicByConfig,
} from './slideDeckBuilder';

const SYNTHETIC_MODULES: ModuleMetadata[] = [
  {
    id: 'unit-0-intro',
    numberLabel: '0',
    sidebarTitle: '0. Introducción',
    headerTitle: 'Introducción General',
    subtitle: 'Presentación del curso.',
    contractTag: 'IIntro',
    keyTakeaway: 'El método científico guía la experimentación.',
  },
  {
    id: 'unit-1-models',
    numberLabel: '1',
    sidebarTitle: '1. Modelos Dinámicos',
    headerTitle: 'Modelos y Simulaciones',
    subtitle: 'Sistemas continuos y discretos.',
    contractTag: 'IModels',
    keyTakeaway: 'Todo sistema dinámico evoluciona según sus ecuaciones de estado.',
  },
  {
    id: 'unit-2-practice',
    numberLabel: '2',
    sidebarTitle: '2. Práctica',
    headerTitle: 'Banco de Problemas',
    subtitle: 'Ejercicios de aplicación.',
    contractTag: 'IPractice',
    keyTakeaway: 'La resolución activa consolida la teoría.',
  },
];

const CURATED_INTRO_SLIDES: ConceptSlide[] = [
  {
    id: 'intro-quote-1',
    moduleId: 'unit-0-intro',
    moduleTitle: 'Introducción General',
    conceptTitle: 'Apertura del Curso',
    conceptSubtitle: 'Epígrafe',
    badgeLabel: 'Cita',
    slideKind: 'quote',
    partIndex: 1,
    totalParts: 1,
    quoteData: {
      quote: 'Medir lo que es medible.',
      author: 'Galileo Galilei',
    },
  },
];

const SYNTHETIC_STUDY_MODULES: Record<string, ModuleStudyData> = {
  'unit-1-models': {
    metadata: SYNTHETIC_MODULES[1],
    concepts: [
      {
        id: 'concept-equilibrium',
        title: 'Estabilidad Asintótica',
        badgeText: 'Teoría de Control',
        summary: 'Un punto de equilibrio es estable si las trayectorias cercanas convergen.',
        bulletPoints: ['Autovalores con parte real negativa', 'Función de energía decreciente'],
      },
    ],
    algorithms: [
      {
        id: 'proc-euler-step',
        name: 'Integración de Euler',
        paradigmTag: 'Métodos Numéricos',
        bestCaseComplexityLatex: 'O(N)',
        averageCaseComplexityLatex: 'O(N)',
        worstCaseComplexityLatex: 'O(N)',
        spaceComplexityLatex: 'O(1)',
        recurrenceOrEquationLatex: 'y_{k+1} = y_k + h f(t_k, y_k)',
        keyInsight: 'Aproxima la derivada mediante diferencias finitas hacia adelante.',
        stepByStepSummary: ['Evaluar pendiente', 'Avanzar paso h'],
        codeSnippets: {
          pseudocode: 'para k = 1 hasta N hacer y = y + h * f(t, y)',
          java: 'y += h * f(t, y);',
          python: 'y += h * f(t, y)',
        },
      },
    ],
  },
};

describe('slideDeckBuilder', () => {
  it('combines curated module decks, generated concept/procedure slides, and practice exercises', () => {
    const deck = buildSlideDeck({
      modules: SYNTHETIC_MODULES,
      studyModulesById: SYNTHETIC_STUDY_MODULES,
      curatedModuleSlidesById: {
        'unit-0-intro': CURATED_INTRO_SLIDES,
      },
      practiceModuleId: 'unit-2-practice',
      exercises: [
        {
          id: 'ex-pendulum',
          number: 1,
          title: 'Oscilador Armónico Simple',
          paradigm: 'Sistemas Lineales',
          difficultyLabel: 'Guía Práctica',
          targetComplexityLatex: 'O(1)',
          problemStatement: 'Determine el período de oscilación para ángulos pequeños.',
        },
      ],
      conceptVisualizersById: {
        'concept-equilibrium': {
          id: 'phase-portrait-sim',
          title: 'Diagrama de Fase Interactivo',
        },
      },
      algorithmVisualizersById: {
        'proc-euler-step': {
          id: 'euler-integrator-sim',
          title: 'Simulador Paso a Paso de Euler',
        },
      },
    });

    expect(deck).toHaveLength(8);
    expect(deck[0].id).toBe('intro-quote-1');
    expect(deck[1].id).toBe('concept-equilibrium-theory');
    expect(deck[2].id).toBe('concept-equilibrium-visualizer');
    expect(deck[2].visualizerId).toBe('phase-portrait-sim');
    expect(deck[3].id).toBe('proc-euler-step-theory');
    expect(deck[4].id).toBe('proc-euler-step-visualizer');
    expect(deck[5].id).toBe('proc-euler-step-pseudocode');
    expect(deck[6].id).toBe('proc-euler-step-code');
    expect(deck[7].id).toBe('ex-pendulum-workspace');
    expect(deck[7].slideKind).toBe('exercise');
  });

  it('supports custom multi-part code slides when configured for a procedure', () => {
    const deck = buildSlideDeck({
      modules: [SYNTHETIC_MODULES[1]],
      studyModulesById: SYNTHETIC_STUDY_MODULES,
      customAlgorithmCodeSlidesById: {
        'proc-euler-step': [
          {
            idSuffix: 'code-predictor',
            conceptTitleSuffix: 'Fase Predictora',
            badgeTitle: 'Código: Predictor',
            snippetTitleSuffix: 'Predictor Explícito',
            snippets: {
              pseudocode: 'y_pred = y + h * f(t, y)',
              java: 'double yPred = y + h * f(t, y);',
              python: 'y_pred = y + h * f(t, y)',
            },
            preferredLanguage: 'java',
          },
          {
            idSuffix: 'code-corrector',
            conceptTitleSuffix: 'Fase Correctora',
            badgeTitle: 'Código: Corrector',
            snippetTitleSuffix: 'Corrector Trapezoidal',
            snippets: {
              pseudocode: 'y_corr = y + (h/2) * (f(t,y) + f(t+h, y_pred))',
              java: 'double yCorr = y + 0.5 * h * (f(t, y) + f(t + h, yPred));',
              python: 'y_corr = y + 0.5 * h * (f(t, y) + f(t + h, y_pred))',
            },
            preferredLanguage: 'java',
          },
        ],
      },
    });

    const eulerSlides = deck.filter((slide) => slide.id.startsWith('proc-euler-step'));

    expect(eulerSlides).toHaveLength(4);
    expect(eulerSlides.map((slide) => slide.id)).toEqual([
      'proc-euler-step-theory',
      'proc-euler-step-pseudocode',
      'proc-euler-step-code-predictor',
      'proc-euler-step-code-corrector',
    ]);
    expect(eulerSlides[2].totalParts).toBe(4);
    expect(eulerSlides[3].partIndex).toBe(4);
  });

  it('resolves the active subtopic by nearest preceding slide or canonical exercise category', () => {
    const subtopics: ModuleSubtopicItem[] = [
      { id: 'sub-1', title: 'Tema A', slideId: 'slide-1' },
      { id: 'sub-2', title: 'Tema B', slideId: 'slide-3' },
    ];
    const moduleSlideIds = ['slide-1', 'slide-2', 'slide-3', 'slide-4'];

    const resolvedFromIntermediateSlide = resolveActiveSubtopicByConfig({
      subtopics,
      moduleSlideIds,
      activeSlideId: 'slide-2',
    });
    const resolvedFromPracticeCategory = resolveActiveSubtopicByConfig({
      subtopics: [{ id: 'sub-practice-kinematics', title: 'Cinemática', paradigm: 'Mecánica' }],
      moduleSlideIds: [],
      isPracticeModule: true,
      activeExerciseCategory: 'Tiro Oblícuo',
      categoryCanonicalLookup: { 'Tiro Oblícuo': 'Mecánica' },
    });

    expect(resolvedFromIntermediateSlide).toBe('sub-1');
    expect(resolvedFromPracticeCategory).toBe('sub-practice-kinematics');
  });
});
