import ejerciciosManifest from '../../../ejercicios/ejercicios_manifest.json';
import ejerciciosBarismo from '../../../ejercicios/ejercicios_barismo.json';
import {
  ExamExerciseComplexityAnalysis,
  ExamExerciseConceptualStrategy,
  ExamExerciseItem,
} from '../../core/domain/coreTypes';
import {
  ExerciseParserConfig,
  parseRawExercisesData,
  RawExercisesData,
} from '../../core/domain/jsonCourseProcessor';

const PARADIGM_LOOKUP: Record<string, string> = {
  barismo_y_extraccion: 'Barismo y Extracción',
  espresso: 'Espresso',
  filtrados: 'Filtrados',
};

const STRATEGY_LOOKUP: Record<string, ExamExerciseConceptualStrategy> = {
  'Barismo y Extracción': {
    invariantAndIntuition:
      'Controlar la cinética de extracción balanceando la resistencia hidráulica, la superficie de contacto y la solubilidad de los compuestos aromáticos.',
    keySteps: [
      'Identificar la variable fuera de rango (tiempo de erogación, caudal, temperatura o ratio).',
      'Aplicar la ecuación correspondiente (Rendimiento EY o corrección de micrones de molienda).',
      'Contrastar el resultado numérico contra el estándar sensorial de la SCA (Taza Dorada).',
    ],
    recurrenceOrTransitionLatex: '\\text{EY} = \\frac{\\text{TDS} \\times \\text{Masa}_{\\text{taza}}}{\\text{Dosis}_{\\text{seco}}}',
  },
};

function inferCoffeeExerciseComplexity(enunciado: string): string {
  if (/extraction yield|ey/i.test(enunciado)) {
    return '18.0\\% - 22.0\\% \\text{ EY}';
  }
  if (/molienda|espresso/i.test(enunciado)) {
    return '1:2 \\text{ en } 25-30\\text{ s}';
  }
  return '\\text{Ratio } 1:16';
}

function buildCoffeeComplexityAnalysis(
  targetComplexityLatex: string,
): ExamExerciseComplexityAnalysis {
  return {
    temporalLatex: targetComplexityLatex,
    spatialLatex: '\\text{TDS } 1.15\\% - 1.45\\%',
    justification:
      'Deducción cuantitativa basada en la refractometría digital y la ley de permeabilidad de lechos porosos de Darcy.',
    theoremApplied: 'Estándar Universal de la Taza Dorada (SCA Golden Cup)',
  };
}

function resolveCoffeeSourceLabels(rawSource: string): {
  difficultyLabel: string;
  sourceOrigin: string;
} {
  const isChampionship = rawSource.toLowerCase().includes('championship') || rawSource.toLowerCase().includes('brewers');
  return {
    difficultyLabel: isChampionship ? 'Nivel Campeonato' : 'Calibración en Barra',
    sourceOrigin: isChampionship ? 'Brewers Cup SCA' : 'Barra de Especialidad',
  };
}

export const COURSE_EXERCISE_PARSER_CONFIG: ExerciseParserConfig = {
  categoryLabels: PARADIGM_LOOKUP,
  defaultCategory: 'Barismo y Extracción',
  strategiesByCategory: STRATEGY_LOOKUP,
  resolveTargetComplexity: inferCoffeeExerciseComplexity,
  resolveComplexityAnalysis: buildCoffeeComplexityAnalysis,
  resolveSourceLabels: resolveCoffeeSourceLabels,
};

const coffeeExercisesPayload: RawExercisesData = {
  metadata: {
    titulo: ejerciciosManifest.titulo,
    descripcion: ejerciciosManifest.descripcion,
    temas: ejerciciosManifest.modulos.map((modulo) => modulo.tema),
  },
  ejercicios_por_tema: {
    barismo_y_extraccion: ejerciciosBarismo.ejercicios,
  },
};

export const EXAM_EXERCISES_LIST: ExamExerciseItem[] = parseRawExercisesData(
  coffeeExercisesPayload,
  COURSE_EXERCISE_PARSER_CONFIG,
);
