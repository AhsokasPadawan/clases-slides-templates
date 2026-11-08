import { describe, expect, it } from 'vitest';
import { ModuleMetadata, ModuleStudyData } from './coreTypes';
import {
  buildStudySearchIndex,
  normalizeForSearch,
  searchStudyEntries,
} from './studySearch';

const SYNTHETIC_MODULES: ModuleMetadata[] = [
  {
    id: 'unit-1-optics',
    numberLabel: '1',
    sidebarTitle: '1. Óptica Geométrica',
    headerTitle: 'Óptica Geométrica y Lentes',
    subtitle: 'Refracción y reflexión.',
    contractTag: 'IOptics',
    keyTakeaway: 'La luz recorre trayectorias de tiempo estacionario.',
  },
  {
    id: 'unit-2-practice',
    numberLabel: '2',
    sidebarTitle: '2. Ejercicios',
    headerTitle: 'Problemas de Examen',
    subtitle: 'Práctica.',
    contractTag: 'IPractice',
    keyTakeaway: 'Aplicación de la Ley de Snell.',
  },
];

const SYNTHETIC_STUDY_MODULES: Record<string, ModuleStudyData> = {
  'unit-1-optics': {
    metadata: SYNTHETIC_MODULES[0],
    concepts: [
      {
        id: 'concept-fermat',
        title: 'Principio de Fermat',
        badgeText: 'Fundamento',
        summary: 'El camino óptico entre dos puntos es estacionario.',
        bulletPoints: ['Deducción de reflexión', 'Deducción de refracción'],
      },
    ],
    algorithms: [
      {
        id: 'method-ray-tracing',
        name: 'Trazado Paraxial de Rayos',
        paradigmTag: 'Matrices ABCD',
        bestCaseComplexityLatex: 'O(k)',
        averageCaseComplexityLatex: 'O(k)',
        worstCaseComplexityLatex: 'O(k)',
        spaceComplexityLatex: 'O(1)',
        recurrenceOrEquationLatex: 'M = M_k \\cdots M_1',
        keyInsight: 'Multiplica matrices de transferencia para lentes delgadas.',
        stepByStepSummary: ['Construir matriz de traslación', 'Construir matriz de refracción'],
        codeSnippets: {
          pseudocode: 'MultiplicarMatrices(A, B)',
          java: 'multiply(a, b);',
          python: 'multiply(a, b)',
        },
      },
    ],
  },
};

describe('studySearch', () => {
  it('strips diacritics and normalizes case for search comparisons', () => {
    const rawText = 'Óptica Geométrica: Refracción y Ángulo Crítico';

    const normalized = normalizeForSearch(rawText);

    expect(normalized).toBe('optica geometrica: refraccion y angulo critico');
  });

  it('indexes concepts, methods, and exercises and prioritizes title matches over body matches', () => {
    const searchIndex = buildStudySearchIndex({
      modules: SYNTHETIC_MODULES,
      studyModulesById: SYNTHETIC_STUDY_MODULES,
      practiceModuleId: 'unit-2-practice',
      exercises: [
        {
          id: 'ex-prism',
          number: 1,
          title: 'Dispersión en Prisma de Cristal',
          paradigm: 'Refracción',
          difficultyLabel: 'Parcial',
          targetComplexityLatex: 'O(1)',
          problemStatement: 'Aplique el Principio de Fermat y la ley de refracción en un prisma.',
        },
      ],
    });

    const fermatResults = searchStudyEntries('fermat', searchIndex);
    const matrixResults = searchStudyEntries('matrices', searchIndex);
    const emptyResults = searchStudyEntries('   ', searchIndex);

    expect(fermatResults).toHaveLength(2);
    expect(fermatResults[0].anchorId).toBe('concept-fermat');
    expect(fermatResults[1].anchorId).toBe('ex-prism');
    expect(matrixResults).toHaveLength(1);
    expect(matrixResults[0].anchorId).toBe('method-ray-tracing');
    expect(emptyResults).toEqual([]);
  });
});
