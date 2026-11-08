import { describe, expect, it } from 'vitest';
import { ModuleMetadata } from './coreTypes';
import {
  parseRawExercisesData,
  parseRawTheoryModuleData,
  slugifyStudyIdentifier,
} from './jsonCourseProcessor';

const SYNTHETIC_MODULE_METADATA: ModuleMetadata = {
  id: 'module-1-foundations',
  numberLabel: '1',
  sidebarTitle: '1. Fundamentos Formales',
  headerTitle: 'Fundamentos del Sistema',
  subtitle: 'Introducción conceptual a modelos lineales.',
  contractTag: 'IFoundationsModule',
  keyTakeaway: 'Los modelos lineales conservan combinaciones afines.',
};

describe('jsonCourseProcessor', () => {
  it('normalizes accents and special symbols when slugifying identifiers', () => {
    const rawTitle = 'Álgebra Lineal: Transformación & Núcleo (2026)';

    const slug = slugifyStudyIdentifier(rawTitle);

    expect(slug).toBe('algebra-lineal-transformacion-nucleo');
  });

  it('parses explicit concepts and algorithms from raw theory payload', () => {
    const rawPayload = {
      conceptos: [
        {
          id: 'concept-linearity',
          title: 'Principio de Superposición',
          badgeText: 'Axioma Base',
          summary: 'Toda transformación lineal preserva suma y producto por escalar.',
          bulletPoints: ['Aditividad f(x + y) = f(x) + f(y)', 'Homogeneidad f(cx) = c f(x)'],
          formulas: [
            {
              label: 'Combinación Lineal',
              latex: 'T(\\alpha u + \\beta v) = \\alpha T(u) + \\beta T(v)',
              description: 'Propiedad estructural.',
            },
          ],
        },
      ],
      algoritmos: [
        {
          id: 'algo-gaussian',
          name: 'Eliminación por Pivoteo',
          paradigmTag: 'Sistemas Lineales',
          worstCaseComplexityLatex: 'O(n^3)',
          spaceComplexityLatex: 'O(1)',
          recurrenceOrEquationLatex: 'T(n) = T(n-1) + O(n^2)',
          keyInsight: 'Anula entradas debajo de la diagonal principal.',
          stepByStepSummary: ['Seleccionar pivote', 'Escalar fila', 'Restar múltiplos'],
          codeSnippets: {
            pseudocode: 'procedimiento Pivoteo(M)',
            java: 'class Solver {}',
            python: 'def pivot(m): pass',
          },
        },
      ],
    };

    const result = parseRawTheoryModuleData(rawPayload, SYNTHETIC_MODULE_METADATA);

    expect(result.metadata).toEqual(SYNTHETIC_MODULE_METADATA);
    expect(result.concepts).toHaveLength(1);
    expect(result.concepts[0].id).toBe('concept-linearity');
    expect(result.concepts[0].formulas?.[0].label).toBe('Combinación Lineal');
    expect(result.algorithms).toHaveLength(1);
    expect(result.algorithms[0].name).toBe('Eliminación por Pivoteo');
  });

  it('extracts concepts and algorithms from sections and subtopics when explicit arrays are absent', () => {
    const rawPhaseOnePayload = {
      modulo: '01_modelos',
      titulo_general: 'Modelos Matemáticos',
      secciones: [
        {
          id: 'sec-1',
          titulo: 'Sección 1: Ecuaciones',
          subtemas: [
            {
              id: 'sub-balanza',
              titulo: 'Equilibrio Estático',
              teoria: 'Resumen principal del equilibrio.\n- Suma de fuerzas nula\n- Suma de momentos nula',
              pseudocodigo: 'algoritmo VerificarEquilibrio(F)\n  devolver suma(F) == 0',
              codigo: {
                lenguaje: 'java',
                codigo_fuente: 'public static boolean check(int sum) { return sum == 0; }',
              },
              analisis_complejidad: {
                temporal: 'O(n)',
                espacial: 'O(1)',
                observaciones: 'Recorrido único del vector de fuerzas.',
              },
            },
          ],
        },
      ],
    };

    const result = parseRawTheoryModuleData(rawPhaseOnePayload, SYNTHETIC_MODULE_METADATA);

    expect(result.concepts).toHaveLength(1);
    expect(result.concepts[0].id).toBe('sub-balanza');
    expect(result.concepts[0].summary).toBe('Resumen principal del equilibrio.');
    expect(result.concepts[0].bulletPoints).toEqual([
      'Suma de fuerzas nula',
      'Suma de momentos nula',
    ]);
    expect(result.algorithms).toHaveLength(1);
    expect(result.algorithms[0].id).toBe('sub-balanza-algo');
    expect(result.algorithms[0].worstCaseComplexityLatex).toBe('O(n)');
  });

  it('parses single-topic and multi-topic exercise payloads with custom configuration', () => {
    const rawExercisesPayload = {
      modulo: 'cinematica',
      ejercicios: [
        {
          id_tema: 1,
          tema: 'cinematica',
          titulo: 'Trayectoria Parabólica en Vacío',
          enunciado: 'Calcule el alcance horizontal máximo dado el ángulo inicial.',
          recurso_visual: null,
          fuente_original: 'Primer Parcial 2025',
          resolucion_propuesta: [
            {
              complejidad_esperada: 'O(1)',
              estrategia_sugerida: 'Descomponer velocidad inicial en ejes ortogonales.',
            },
          ],
        },
      ],
    };

    const parsedExercises = parseRawExercisesData(rawExercisesPayload, {
      categoryLabels: { cinematica: 'Mecánica Clásica' },
      canonicalIdsBySlug: {
        'trayectoria-parabolica-en-vacio': 'ex-custom-parabola',
      },
    });

    expect(parsedExercises).toHaveLength(1);
    expect(parsedExercises[0].id).toBe('ex-custom-parabola');
    expect(parsedExercises[0].paradigm).toBe('Mecánica Clásica');
    expect(parsedExercises[0].difficultyLabel).toBe('Examen Parcial');
    expect(parsedExercises[0].targetComplexityLatex).toBe('O(1)');
    expect(parsedExercises[0].conceptualStrategy?.invariantAndIntuition).toBe(
      'Descomponer velocidad inicial en ejes ortogonales.',
    );
  });
});
